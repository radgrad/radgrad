// import { check } from 'meteor/check';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { DesiredDegrees } from '../degree/DesiredDegreeCollection';
import { Feedbacks } from './FeedbackCollection';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as courseUtils from '../course/CourseUtilities';
import * as oppUtils from '../opportunity/OpportunityUtilities';
import * as yearUtils from '../year/AcademicYearUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import { BS_CS_LIST, BA_ICS_LIST } from '../degree-program/degree-program';

/** @module FeedbackFunctions */

/* eslint-disable class-methods-use-this */

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

/**
 * A class containing Feedback functions. Each Feedback function is a method on the singleton instance
 * FeedbackFunctions.
 * @example
 * import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
 * :
 * :
 * FeedbackFunctions.recommendedCoursesThisSemesterByInterest(studentID);
 * @class FeedbackFunctions
 */
export class FeedbackFunctionClass {
  /**
   * Clears the feedback instances.
   * @param studentID
   * @param area
   * @private
   */
  clearFeedbackInstances(studentID, area) {
    const userID = studentID;
    const instances = FeedbackInstances.find({ userID, area }).fetch();
    // console.log(`found ${instances.length} feedback instances for ${studentID} ${area}`);
    _.map(instances, (fi) => {
      FeedbackInstances.removeIt(fi._id);
    });
  }

  /**
   * Checks the student's degree plan to ensure that all the prerequisites are met.
   * @param studentID the student's ID.
   */
  checkPrerequisites(studentID) {
    // console.log('checkPrerequisites');
    const f = Feedbacks.find({ name: 'Prerequisite missing' }).fetch()[0];
    const feedback = Slugs.getNameFromID(f.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    const cis = CourseInstances.find({ studentID }).fetch();
    cis.forEach((ci) => {
      const semester = Semesters.findDoc(ci.semesterID);
      const semesterName = Semesters.toString(ci.semesterID, false);
      const course = Courses.findDoc(ci.courseID);
      if (course) {
        const prereqs = course.prerequisites;
        prereqs.forEach((p) => {
          const courseID = Slugs.getEntityID(p, 'Course');
          const prerequisiteCourse = Courses.find({ _id: courseID }).fetch()[0];
          const preCiIndex = _.findIndex(cis, function find(obj) {
            return obj.courseID === courseID;
          });
          if (preCiIndex !== -1) {
            const preCi = cis[preCiIndex];
            const preCourse = Courses.findDoc(preCi.courseID);
            const preSemester = Semesters.findDoc(preCi.semesterID);
            if (preSemester) {
              if (preSemester.sortBy >= semester.sortBy) {
                const semesterName2 = Semesters.toString(preSemester._id, false);
                const description = `${semesterName}: ${course.number}'s prerequisite ${preCourse.number} is after or` +
                    ` in ${semesterName2}.`;
                FeedbackInstances.define({
                  feedback,
                  user: studentID,
                  description,
                  area,
                });
              }
            }
          } else {
            const description = `${semesterName}: Prerequisite ${prerequisiteCourse.number} for ${course.number}` +
                ' not found.';
            FeedbackInstances.define({
              feedback,
              user: studentID,
              description,
              area,
            });
          }
        });
      }
    });
  }

  /**
   * Checks the student's degree plan to ensure that it satisfies the degree requirements.
   * @param studentID the student's ID.
   */
  checkCompletePlan(studentID) {
    // console.log('checkCompletePlan');
    const f = Feedbacks.findDoc({ name: 'Required course missing' });
    const feedback = Slugs.getNameFromID(f.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    const student = Users.findDoc(studentID);
    const courseIDs = Users.getCourseIDs(studentID);
    const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
    let courses;
    if (degree.shortName.startsWith('B.S.')) {
      courses = BS_CS_LIST.slice(0);
    }
    if (degree.shortName.startsWith('B.A.')) {
      courses = BA_ICS_LIST.slice(0);
    }
    courses = this._missingCourses(courseIDs, courses);
    if (courses.length > 0) {
      let description = 'Your degree plan is missing: ';
      const currentRoute = FlowRouter.current().path;
      const index = getPosition(currentRoute, '/', 3);
      const basePath = currentRoute.substring(0, index + 1);
      _.map(courses, (slug) => {
        if (Array.isArray(slug)) {
          _.map(slug, (s) => {
            const id = Slugs.getEntityID(s, 'Course');
            const course = Courses.findDoc(id);
            // eslint-disable-next-line max-len
            description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug}) or `;
          });
          description = description.substring(0, description.length - 2);
        } else
          if (slug.startsWith('ics4')) {
            description = `${description} \n- a 400 level elective, `;
          } else {
            const id = Slugs.getEntityID(slug, 'Course');
            const course = Courses.findDoc(id);
            // eslint-disable-next-line max-len
            description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug}), `;
          }
      });
      description = description.substring(0, description.length - 2);
      FeedbackInstances.define({
        feedback,
        user: studentID,
        description,
        area,
      });
    }
  }

  /**
   * Checks the student's degree plan to ensure that there aren't too many ICS courses in any one semester.
   * @param studentID the student's ID.
   */
  checkOverloadedSemesters(studentID) {
    // console.log('checkOverloadedSemesters');
    const feedbackDoc = Feedbacks.findDoc({ name: 'Semester overloaded' });
    const feedback = Slugs.getNameFromID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    const semesters = yearUtils.getStudentSemesters(studentID);
    let haveOverloaded = false;
    let description = 'Your plan is overloaded. ';
    _.map(semesters, (semesterID) => {
      const cis = CourseInstances.find({ studentID, semesterID }).fetch();
      if (cis.length > 2) {
        haveOverloaded = true;
        description = `${description} ${Semesters.toString(semesterID, false)}, `;
      }
    });
    description = description.substring(0, description.length - 2);
    if (haveOverloaded) {
      FeedbackInstances.define({
        feedback,
        user: studentID,
        description,
        area,
      });
    }
  }

  /**
   * Creates recommended courses based upon the student's interests. Only generates feedback if the student's plann
   * is missing courses.
   * @param studentID the student's ID.
   */
  generateRecommendedCourse(studentID) {
    // console.log('generateRecommendedCourse');
    const feedbackDoc = Feedbacks.findDoc({ name: 'Course recommendations based on interests' });
    const feedback = Slugs.getNameFromID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    const coursesTakenSlugs = [];
    const student = Users.findDoc(studentID);
    const courseIDs = Users.getCourseIDs(studentID);
    const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
    let coursesNeeded;
    if (degree.shortName.startsWith('B.S.')) {
      coursesNeeded = BS_CS_LIST.slice(0);
    }
    if (degree.shortName.startsWith('B.A.')) {
      coursesNeeded = BA_ICS_LIST.slice(0);
    }
    _.map(courseIDs, (cID) => {
      const course = Courses.findDoc(cID);
      coursesTakenSlugs.push(Slugs.getNameFromID(course.slugID));
    });
    this.clearFeedbackInstances(studentID, area);
    const missing = this._missingCourses(courseIDs, coursesNeeded);
    // console.log(missing);
    if (missing.length > 0) {
      let description = 'Consider taking the following class to meet the degree requirement: ';
      if (missing.length > 1) {
        description = 'Consider taking the following classes to meet the degree requirement: ';
      }
      const currentRoute = FlowRouter.current().path;
      const index = getPosition(currentRoute, '/', 3);
      const basePath = currentRoute.substring(0, index + 1);
      _.map(missing, (slug) => {
        if (Array.isArray(slug)) {
          const course = courseUtils.chooseBetween(slug, studentID, coursesTakenSlugs);
          const courseSlug = Slugs.findDoc(course.slugID);
          description = 'Consider taking the following class to meet the degree requirement: ';
          // eslint-disable-next-line max-len
          description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${courseSlug.name})`;
        } else
          if (slug.startsWith('ics3')) {
            const courseID = Slugs.getEntityID(slug, 'Course');
            const course = Courses.findDoc(courseID);
            // eslint-disable-next-line max-len
            description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug}), `;
          } else
            if (slug.startsWith('ics4')) {
              let bestChoices = courseUtils.bestStudent400LevelCourses(studentID, coursesTakenSlugs);
              if (bestChoices) {
                const len = bestChoices.length;
                if (len > 5) {
                  bestChoices = _.drop(bestChoices, len - 5);
                }
                _.map(bestChoices, (course) => {
                  const cSlug = Slugs.findDoc(course.slugID);
                  // eslint-disable-next-line max-len
                  description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${cSlug.name}), `;
                });
              }
            }
      });
      FeedbackInstances.define({
        feedback,
        user: studentID,
        description,
        area,
      });
    }
  }

  generateRecommended400LevelCourse(studentID) {
    // console.log('generateRecommended400');
    const feedbackDoc = Feedbacks.findDoc({ name: 'Course recommendations based on interests' });
    const feedback = Slugs.getNameFromID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    const coursesTakenSlugs = [];
    const student = Users.findDoc(studentID);
    const courseIDs = Users.getCourseIDs(studentID);
    const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
    let coursesNeeded;
    if (degree.shortName.startsWith('B.S.')) {
      coursesNeeded = BS_CS_LIST.slice(0);
    }
    if (degree.shortName.startsWith('B.A.')) {
      coursesNeeded = BA_ICS_LIST.slice(0);
    }
    _.map(courseIDs, (cID) => {
      const course = Courses.findDoc(cID);
      coursesTakenSlugs.push(Slugs.getNameFromID(course.slugID));
    });
    if (this._missingCourses(courseIDs, coursesNeeded).length > 0) {
      let bestChoices = courseUtils.bestStudent400LevelCourses(studentID, coursesTakenSlugs);
      const currentRoute = FlowRouter.current().path;
      const index = getPosition(currentRoute, '/', 3);
      const basePath = currentRoute.substring(0, index + 1);
      if (bestChoices) {
        const len = bestChoices.length;
        if (len > 5) {
          bestChoices = _.drop(bestChoices, len - 5);
        }
        this.clearFeedbackInstances(studentID, area);
        let description = 'Consider taking the following classes to meet the degree requirement: ';
        _.map(bestChoices, (course) => {
          const slug = Slugs.findDoc(course.slugID);
          // eslint-disable-next-line max-len
          description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug.name}), `;
        });
        description = description.substring(0, description.length - 2);
        FeedbackInstances.define({
          feedback,
          user: studentID,
          description,
          area,
        });
      }
    } else {
      this.clearFeedbackInstances(studentID, area);
    }
  }

  /**
   * Creates a recommended opportunities FeedbackInstance for the given student and the current semester.
   * @param studentID the student's ID.
   */
  generateRecommendedCurrentSemesterOpportunities(studentID) {
    // console.log('generateRecommendedCurrentSemesterOpportunities');
    const feedbackDoc = Feedbacks.findDoc({ name: 'Opportunity recommendations based on interests' });
    const feedback = Slugs.getNameFromID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    let bestChoices = oppUtils.getStudentCurrentSemesterOpportunityChoices(studentID);
    const currentRoute = FlowRouter.current().path;
    const index = getPosition(currentRoute, '/', 3);
    const basePath = currentRoute.substring(0, index + 1);
    const semesterID = Semesters.getCurrentSemester();
    const oppInstances = OpportunityInstances.find({ studentID, semesterID }).fetch();
    if (oppInstances.length === 0) {  // only make suggestions if there are no opportunities planned.
      // console.log(bestChoices);
      if (bestChoices) {
        const len = bestChoices.length;
        if (len > 3) {
          bestChoices = _.drop(bestChoices, len - 3);
        }
        this.clearFeedbackInstances(studentID, area);
        let description = 'Consider the following opportunities for this semester: ';
        _.map(bestChoices, (opp) => {
          const slug = Slugs.findDoc(opp.slugID);
          description = `${description} \n- [${opp.name}](${basePath}explorer/opportunities/${slug.name}), `;
        });
        description = description.substring(0, description.length - 2);
        FeedbackInstances.define({
          feedback,
          user: studentID,
          description,
          area,
        });
      }
    }
  }

  /**
   * Creates a recommendation for getting to the next RadGrad Level.
   * @param studentID The student's ID.
   */
  generateNextLevelRecommendation(studentID) {
    // console.log('checkOverloadedSemesters');
    const feedbackDoc = Feedbacks.findDoc({ name: 'Recommendation for next Level' });
    const feedback = Slugs.getNameFromID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    const student = Users.findDoc(studentID);
    const currentRoute = FlowRouter.current().path;
    const index = getPosition(currentRoute, '/', 3);
    const basePath = currentRoute.substring(0, index + 1);
    let description = 'Getting to the next Level: ';
    switch (student.level) {
      case 0:
        // eslint-disable-next-line max-len
        description = `${description} Take and pass [ICS 111](${basePath}explorer/courses/ics111) and [ICS 141](${basePath}explorer/courses/ics141)`;
        break;
      case 1:
        // eslint-disable-next-line max-len
        description = `${description} Take and pass [ICS 211](${basePath}explorer/courses/ics211) and [ICS 241](${basePath}explorer/courses/ics241)`;
        break;
      case 2:
        description = `${description} Get some innovation and experience [ICE points](${basePath}home/ice)`;
        break;
      case 3:
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice)`;
        break;
      case 4:
        // eslint-disable-next-line max-len
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice) and go review something.`;
        break;
      case 5:
        // eslint-disable-next-line max-len
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice) and do more reviews.`;
        break;
      default:
        description = '';
    }
    if (description) {
      FeedbackInstances.define({
        feedback,
        user: studentID,
        description,
        area,
      });
    }
  }

  /**
   * Returns an array of the course slugs that are missing from the plan.
   * @param courseIDs The IDs of the courses taken by the student.
   * @param coursesNeeded An array of the course slugs needed for the degree.
   * @return {*|Array.<T>}
   */
  _missingCourses(courseIDs, coursesNeeded) {
    const courses = coursesNeeded.splice(0);
    _.map(courseIDs, (id) => {
      const course = Courses.findDoc(id);
      const slug = Slugs.getNameFromID(course.slugID);
      const index = _.indexOf(courses, slug);
      if (index !== -1) {
        courses.splice(index, 1);
      } else
        if (slug.startsWith('ics4')) {
          if (_.indexOf(courses, 'ics4xx') !== -1) {
            courses.splice(_.indexOf(courses, 'ics4xx'), 1);
          }
        } else
          if (_.indexOf(courses[0], slug) !== -1) {
            courses.splice(0, 1);
          } else
            if (_.indexOf(courses[1], slug) !== -1) {
              courses.splice(1, 1);
            }
    });
    return courses;
  }
}

/**
 * Singleton instance for all FeedbackFunctions.
 * @type {FeedbackFunctionClass}
 */
export const FeedbackFunctions = new FeedbackFunctionClass();
