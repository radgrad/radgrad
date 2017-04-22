import { Meteor } from 'meteor/meteor';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DesiredDegrees } from './../degree/DesiredDegreeCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';

/** @module AcademicPlan */

class AcademicPlanCollection extends BaseCollection {

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
   * Defines a DesiredDegreeInstance.
   *    * @example
   * // To define an instance of a CS course:
   * DesiredDegreeInstances.define({ degreeSlug: 'bs-cs',
   *                                 name: 'B.S. in Computer Science'
   *                                 semester: 'Spring-2016',
   *                                 coursesPerSemester: [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0],
   *                                 courseList: ['ics111', 'ics141, 'ics211', 'ics241, 'ics311', 'ics314',
    *                                 'ics212', 'ics321', 'ics313,ics361', 'ics312,ics331', 'ics332', 'ics4xx',
     *                                 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx'] })
   * @param degreeSlug
   * @param startSemesterID
   * @param coursesPerSemester
   * @param courseList
   * @param endSemesterID
   * @returns {*}
   */
  define({ degreeSlug, name, semester, coursesPerSemester, courseList }) {
    const degreeID = Slugs.getEntityID(degreeSlug, 'DesiredDegree');
    const effectiveSemesterID = Semesters.getID(semester);
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

export const AcademicPlans = new AcademicPlanCollection();
radgradCollections.push(AcademicPlans);
