import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '../base/BaseCollection';
import { radgradCollections } from '../base/RadGradCollections';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';

/** @module api/degree-plan/AcademicPlanCollection */

/**
 * AcademicPlans holds the different academic plans possible in this department.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class AcademicPlanCollection extends BaseCollection {

  /**
   * Creates the AcademicPlan collection.
   */
  constructor() {
    super('AcademicPlan', new SimpleSchema({
      degreeID: { type: SimpleSchema.RegEx.Id },
      name: { type: String },
      effectiveSemesterID: { type: SimpleSchema.RegEx.Id },
      coursesPerSemester: { type: [Number], minCount: 12, maxCount: 12 },
      courseList: { type: [String] },
    }));
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, degreeID: 1, effectiveSemesterID: 1 });
    }
  }

  /**
   * Defines an AcademicPlan.
   * @example
   *     AcademicPlans.define({ degreeSlug: 'bs-cs',
   *                        name: 'B.S. in Computer Science'
   *                        semester: 'Spring-2016',
   *                        coursesPerSemester: [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0],
   *                        courseList: ['ics111-1', 'ics141-1, 'ics211-1', 'ics241-1', 'ics311-1', 'ics314-1',
   *                                     'ics212-1', 'ics321-1', 'ics313,ics361-1', 'ics312,ics331-1', 'ics332-1',
   *                                     'ics400+-1', 'ics400+-2', 'ics400+-3', 'ics400+-4', 'ics400+-5'] })
   * @param degreeSlug The slug for the desired degree.
   * @param name The name of the academic plan.
   * @param semester the slug for the semester.
   * @param coursesPerSemester an array of the number of courses to take in each semester.
   * @param courseList an array of PlanChoices. The choices for each course.
   * @returns {*}
   */
  define({ degreeSlug, name, semester, coursesPerSemester, courseList }) {
    const degreeID = Slugs.getEntityID(degreeSlug, 'DesiredDegree');
    let effectiveSemesterID;
    try {
      effectiveSemesterID = Semesters.getID(semester);
    } catch (e) {
      const split = semester.split('-');
      const term = split[0];
      const year = parseInt(split[1], 10);
      effectiveSemesterID = Semesters.define({ term, year });
    }
    const doc = this._collection.findOne({ degreeID, name, effectiveSemesterID });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({
      degreeID, name, effectiveSemesterID, coursesPerSemester, courseList,
    });
  }

  /**
   * Returns an array of problems. Checks the semesterID and DesiredDegree ID.
   * @returns {Array} An array of problem messages.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Semesters.isDefined(doc.effectiveSemesterID)) {
        problems.push(`Bad semesterID: ${doc.effectiveSemesterID}`);
      }
      if (!DesiredDegrees.isDefined(doc.degreeID)) {
        problems.push(`Bad desiredDegreeID: ${doc.degreeID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the AcademicPlan docID in a format acceptable to define().
   * @param docID The docID of a HelpMessage.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const degree = DesiredDegrees.findDoc(doc.degreeID);
    const degreeSlug = Slugs.findDoc(degree.slugID).name;
    const name = doc.name;
    const semesterDoc = Semesters.findDoc(doc.effectiveSemesterID);
    const semester = Slugs.findDoc(semesterDoc.slugID).name;
    const coursesPerSemester = doc.coursesPerSemester;
    const courseList = doc.courseList;
    return { degreeSlug, name, semester, coursesPerSemester, courseList };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const AcademicPlans = new AcademicPlanCollection();
radgradCollections.push(AcademicPlans);
