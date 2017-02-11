// import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { DesiredDegrees } from '../degree/DesiredDegreeCollection';
import { Feedbacks } from './FeedbackCollection';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as oppUtils from '../opportunity/OpportunityUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/** @module FeedbackFunctions */


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
   * Creates the FeedbackFunction instance.
   */
  constructor() {
    // ensure the Feedback definitions exist before we work.
    // _.map(feedbackDefinitions, (definition) => {
    //   if (Feedbacks.find({ name: definition.name }).count() === 0) {
    //     Feedbacks.define(definition);
    //   }
    // });
  }

  /**
   * Clears the feedback instances.
   * @param studentID
   * @param area
   * @private
   */
  clearFeedbackInstances(studentID, area) {
    const userID = studentID;
    const instances = FeedbackInstances.find({ userID, area }).fetch();
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
    const feedback = Slugs.getEntityID(f.slugID, 'Feedback');
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
    const f = Feedbacks.find({ name: 'Required course missing' }).fetch()[0];
    const feedback = Slugs.getEntityID(f.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    this.clearFeedbackInstances(studentID, area);
    const student = Users.findDoc(studentID);
    const courseIDs = Users.getCourseIDs(studentID);
    const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
    if (degree.shortName.startsWith('B.S.')) {
      _.map(courseIDs, (id) => {
        const course = Courses.findDoc(id);
        const slug = Slugs.findDoc(course.slugID);
        console.log(slug.name);
      });
    }
    if (degree.shortName.startsWith('B.A.')) {
      _.map(courseIDs, (id) => {
        console.log(Courses.findDoc(id).shortName);
      });
    }

  }

  /**
   * Creates a recommended opportunities FeedbackInstance for the given student and the current semester.
   * @param studentID the student's ID.
   */
  generateRecommendedCurrentSemesterOpportunities(studentID) {
    const feedbackDoc = Feedbacks.findDoc({ name: 'Opportunity recommendations based on interests' });
    const feedback = Slugs.getEntityID(feedbackDoc.slugID, 'Feedback');
    const area = `ffn-${feedback}`;
    let bestChoices = oppUtils.getStudentCurrentSemesterOpportunityChoices(studentID);
    // console.log(bestChoices);
    if (bestChoices) {
      const len = bestChoices.length;
      if (len > 3) {
        bestChoices = _.drop(bestChoices, len - 3);
      }
      this.clearFeedbackInstances(studentID, area);
      let description = 'Consider the following opportunities for this semester: ';
      _.map(bestChoices, (opp) => {
        description = `${description} ${opp.name}, `;
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
 * Singleton instance for all FeedbackFunctions.
 * @type {FeedbackFunctionClass}
 */
export const FeedbackFunctions = new FeedbackFunctionClass();
