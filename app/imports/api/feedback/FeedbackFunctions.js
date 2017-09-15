import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { clearFeedbackInstancesMethod } from './FeedbackInstanceCollection.methods';
import { defineMethod } from '../base/BaseCollection.methods';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import * as courseUtils from '../course/CourseUtilities';
import * as oppUtils from '../opportunity/OpportunityUtilities';
import * as yearUtils from '../degree-plan/AcademicYearUtilities';
import * as planUtils from '../degree-plan/PlanChoiceUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/* eslint-disable class-methods-use-this */

/**
 * Provides FeedbackFunctions. Each FeedbackFunction is a method of the singleton instance FeedbackFunctions.
 * Each FeedbackFunction accepts a studentID and updates the FeedbackInstanceCollection based upon the current state
 * of the student. Normally, the FeedbackFunction will first delete any FeedbackInstances it previously created
 * for that student (if any), then add new ones if appropriate.
 *
 * Note that FeedbackFunctions call Meteor Methods to define and delete FeedbackInstances, so these functions must
 * be called on the client side.
 * @example
 * import { FeedbackFunctions } from '../feedback/FeedbackFunctions';
 *   :
 * FeedbackFunctions.recommendedCoursesThisSemesterByInterest(studentID);
 * @class FeedbackFunctions
 * @memberOf api/feedback
 */
export class FeedbackFunctionClass {

  /**
   * Checks the student's degree plan to ensure that all the prerequisites are met.
   * @param user the student's ID.
   */
  checkPrerequisites(user) {
    const functionName = 'checkPrerequisites';
    const feedbackType = FeedbackInstances.WARNING;
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    // Now iterate through all the CourseInstances associated with this student.
    const cis = CourseInstances.find({ studentID }).fetch();
    cis.forEach((ci) => {
      const semester = Semesters.findDoc(ci.semesterID);
      if (semester.semesterNumber > currentSemester.semesterNumber) {
        const semesterName = Semesters.toString(ci.semesterID, false);
        const course = Courses.findDoc(ci.courseID);
        if (course) {
          const prereqs = course.prerequisites;
          prereqs.forEach((p) => {
            const courseID = Slugs.getEntityID(p, 'Course');
            const prerequisiteCourse = Courses.findDoc({ _id: courseID });
            const preCiIndex = _.findIndex(cis, function find(obj) {
              return obj.courseID === courseID;
            });
            if (preCiIndex !== -1) {
              const preCi = cis[preCiIndex];
              const preCourse = Courses.findDoc(preCi.courseID);
              const preSemester = Semesters.findDoc(preCi.semesterID);
              if (preSemester) {
                if (preSemester.semesterNumber >= semester.semesterNumber) {
                  const semesterName2 = Semesters.toString(preSemester._id, false);
                  const description = `${semesterName}: ${course.number}'s prerequisite ${preCourse.number} is ` +
                      `after or in ${semesterName2}.`;
                  const definitionData = { user, functionName, description, feedbackType };
                  defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
                }
              }
            } else {
              const description = `${semesterName}: Prerequisite ${prerequisiteCourse.number} for ${course.number}` +
                  ' not found.';
              const definitionData = { user, functionName, description, feedbackType };
              defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
            }
          });
        }
      }
    });
  }

  /**
   * Checks the student's degree plan to ensure that it satisfies the degree requirements.
   * @param user the student's ID.
   */
  checkCompletePlan(user) {
    const functionName = 'checkCompletePlan';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.WARNING;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const studentProfile = Users.getProfile(user);
    const courseIDs = StudentProfiles.getCourseIDs(user);
    let courses = [];
    const academicPlan = AcademicPlans.findDoc(studentProfile.academicPlanID);
    courses = academicPlan.courseList.slice(0);
    courses = this._missingCourses(courseIDs, courses);
    if (courses.length > 0) {
      let description = 'Your degree plan is missing: \n\n';
      const basePath = this._getBasePath(user);
      _.forEach(courses, (slug) => {
        if (!planUtils.isSingleChoice(slug)) {
          const slugs = planUtils.complexChoiceToArray(slug);
          description = `${description}\n\n- `;
          _.forEach(slugs, (s) => {
            const id = Slugs.getEntityID(planUtils.stripCounter(s), 'Course');
            const course = Courses.findDoc(id);
            // eslint-disable-next-line max-len
            description = `${description} [${course.number} ${course.shortName}](${basePath}explorer/courses/${s}) or `;
          });
          description = description.substring(0, description.length - 4);
          description = `${description}, `;
        } else
          if (slug.indexOf('400+') !== -1) {
            description = `${description} \n- a 400 level elective, `;
          } else
            if (slug.indexOf('300+') !== -1) {
              description = `${description} \n- a 300+ level elective, `;
            } else {
              const id = Slugs.getEntityID(planUtils.stripCounter(slug), 'Course');
              const course = Courses.findDoc(id);
              // eslint-disable-next-line max-len
              description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${planUtils.stripCounter(slug)}), `;
            }
      });
      description = description.substring(0, description.length - 2);
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  /**
   * Checks the student's degree plan to ensure that there aren't too many courses in any one semester.
   * @param user the student's ID.
   */
  checkOverloadedSemesters(user) {
    const functionName = 'checkOverloadedSemesters';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.WARNING;
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const currentSemester = Semesters.getCurrentSemesterDoc();
    const semesters = yearUtils.getStudentSemesters(user);
    let haveOverloaded = false;
    let description = 'Your plan is overloaded. ';
    _.forEach(semesters, (semesterID) => {
      const semester = Semesters.findDoc(semesterID);
      if (semester.semesterNumber > currentSemester.semesterNumber) {
        const cis = CourseInstances.find({ studentID, semesterID, note: /ICS/ }).fetch();
        if (cis.length > 2) {
          haveOverloaded = true;
          description = `${description} ${Semesters.toString(semesterID, false)}, `;
        }
      }
    });
    description = description.substring(0, description.length - 2);
    if (haveOverloaded) {
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  /**
   * Creates recommended courses based upon the student's interests. Only generates feedback if the student's plan
   * is missing courses.
   * @param user the student's ID.
   */
  generateRecommendedCourse(user) {
    const functionName = 'generateRecommendedCourse';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const coursesTakenSlugs = [];
    const studentProfile = Users.getProfile(user);
    const courseIDs = StudentProfiles.getCourseIDs(user);
    const academicPlanID = studentProfile.academicPlanID;
    const academicPlan = AcademicPlans.findDoc(academicPlanID);
    const coursesNeeded = academicPlan.courseList.slice(0);
    _.forEach(courseIDs, (cID) => {
      const course = Courses.findDoc(cID);
      coursesTakenSlugs.push(Slugs.getNameFromID(course.slugID));
    });
    const missing = this._missingCourses(courseIDs, coursesNeeded);
    if (missing.length > 0) {
      let description = 'Consider taking the following class to meet the degree requirement: ';
      // if (missing.length > 1) {
      //   description = 'Consider taking the following classes to meet the degree requirement: ';
      // }
      const basePath = this._getBasePath(user);
      let slug = missing[0];
      if (planUtils.isComplexChoice(slug) || planUtils.isSimpleChoice(slug)) {
        slug = planUtils.complexChoiceToArray(slug);
      }
      if (Array.isArray(slug)) {
        const course = courseUtils.chooseBetween(slug, user, coursesTakenSlugs);
        if (course) {
          const courseSlug = Slugs.findDoc(course.slugID);
          // eslint-disable-next-line max-len
          description = `${description} \n\n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${courseSlug.name}), `;
        }
      } else
        if (slug.startsWith('ics_4')) {
          const bestChoice = courseUtils.chooseStudent400LevelCourse(user, coursesTakenSlugs);
          if (bestChoice) {
            const cSlug = Slugs.findDoc(bestChoice.slugID);
            // eslint-disable-next-line max-len
            description = `${description} \n- [${bestChoice.number} ${bestChoice.shortName}](${basePath}explorer/courses/${cSlug.name}), `;
          }
        } else
          if (slug.startsWith('ics')) {
            const courseID = Slugs.getEntityID(planUtils.stripCounter(slug), 'Course');
            const course = Courses.findDoc(courseID);
            // eslint-disable-next-line max-len
            description = `${description} \n\n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug}), `;
          }
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  generateRecommended400LevelCourse(user) {
    const functionName = 'generateRecommended400LevelCourse';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const coursesTakenSlugs = [];
    const studentProfile = Users.getProfile(user);
    const courseIDs = StudentProfiles.getCourseIDs(user);
    const academicPlan = studentProfile.academicPlanID;
    const coursesNeeded = academicPlan.courseList.slice(0);
    _.forEach(courseIDs, (cID) => {
      const course = Courses.findDoc(cID);
      coursesTakenSlugs.push(Slugs.getNameFromID(course.slugID));
    });
    if (this._missingCourses(courseIDs, coursesNeeded).length > 0) {
      let bestChoices = courseUtils.bestStudent400LevelCourses(user, coursesTakenSlugs);
      const basePath = this._getBasePath(user);
      if (bestChoices) {
        const len = bestChoices.length;
        if (len > 5) {
          bestChoices = _.drop(bestChoices, len - 5);
        }
        let description = 'Consider taking the following classes to meet the degree requirement: ';
        _.forEach(bestChoices, (course) => {
          const slug = Slugs.findDoc(course.slugID);
          // eslint-disable-next-line max-len
          description = `${description} \n- [${course.number} ${course.shortName}](${basePath}explorer/courses/${slug.name}), `;
        });
        description = description.substring(0, description.length - 2);
        const definitionData = { user, functionName, description, feedbackType };
        defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
      }
    } else {
      // TODO Why is this second call to clear needed? We do it at the top of this function.
      clearFeedbackInstancesMethod.call({ user, functionName });
    }
  }

  /**
   * Creates a recommended opportunities FeedbackInstance for the given student and the current semester.
   * @param user the student's ID.
   */
  generateRecommendedCurrentSemesterOpportunities(user) {
    const functionName = 'generateRecommendedCurrentSemesterOpportunities';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    let bestChoices = oppUtils.getStudentCurrentSemesterOpportunityChoices(user);
    const basePath = this._getBasePath(user);
    const semesterID = Semesters.getCurrentSemesterID();
    const oppInstances = OpportunityInstances.find({ studentID, semesterID }).fetch();
    if (oppInstances.length === 0) {  // only make suggestions if there are no opportunities planned.
      // console.log(bestChoices);
      if (bestChoices) {
        const len = bestChoices.length;
        if (len > 3) {
          bestChoices = _.drop(bestChoices, len - 3);
        }
        let description = 'Consider the following opportunities for this semester: ';
        _.forEach(bestChoices, (opp) => {
          const slug = Slugs.findDoc(opp.slugID);
          description = `${description} \n- [${opp.name}](${basePath}explorer/opportunities/${slug.name}), `;
        });
        description = description.substring(0, description.length - 2);
        const definitionData = { user, functionName, description, feedbackType };
        defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
      }
    }
  }

  /**
   * Creates a recommendation for getting to the next RadGrad Level.
   * @param user The student's ID.
   */
  generateNextLevelRecommendation(user) {
    const functionName = 'generateNextLevelRecommendation';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const studentProfile = Users.getProfile(user);
    // Need to build the route not use current route since might be the Advisor.
    const basePath = this._getBasePath(user);
    let description = 'Getting to the next Level: ';
    switch (studentProfile.level) {
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
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  /**
   * Returns an array of the course slugs that are missing from the plan.
   * @param courseIDs The IDs of the courses taken by the student.
   * @param coursesNeeded An array of the course slugs needed for the degree.
   * @return {*|Array.<T>}
   */
  _missingCourses(courseIDs, coursesNeeded) {
    const planChoices = coursesNeeded.splice(0);
    _.forEach(courseIDs, (id) => {
      const course = Courses.findDoc(id);
      const slug = Slugs.getNameFromID(course.slugID);
      const index = planUtils.planIndexOf(planChoices, slug);
      if (index !== -1) {
        planChoices.splice(index, 1);
      }
    });
    return planChoices;
  }

  _getBasePath(studentID) {
    const getPosition = function (string, subString, index) {
      return string.split(subString, index).join(subString).length;
    };
    let basePath = '';
    if (FlowRouter.current()) {
      const currentRoute = FlowRouter.current().path;
      if (currentRoute.startsWith('/advisor')) {
        const username = Users.getProfile(studentID).username;
        basePath = `/student/${username}/`;
      } else {
        const index = getPosition(currentRoute, '/', 3);
        basePath = currentRoute.substring(0, index + 1);
      }
    }
    return basePath;
  }
}

/**
 * Singleton instance for all FeedbackFunctions.
 * @type {FeedbackFunctionClass}
 * @memberOf api/feedback
 */
export const FeedbackFunctions = new FeedbackFunctionClass();
