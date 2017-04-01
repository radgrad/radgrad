import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module DesiredDegree */

/**
 * DesiredDegreeInstances holds the different requirements for the set of degrees possible in this department.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class DesiredDegreeInstanceCollection extends BaseInstanceCollection {

  /**
   * Creates the DesiredDegreeInstance collection.
   */
  constructor() {
    super('DesiredDegreeInstance', new SimpleSchema({
      degreeID: { type: SimpleSchema.RegEx.Id },
      startSemesterID: { type: SimpleSchema.RegEx.Id }, // The semester that this degree requirements started.
      endSemesterID: { type: SimpleSchema.RegEx.Id, optional: true }, // The last semester of this requirement.
      coursesPerSemester: { type: [Number] },  // should have a length of 8
      // courseList: { type: Object, blackbox: true }, // list of slugs or choices
    }));
  }

  /**
   * Defines a DesiredDegreeInstance.
   *    * @example
   * // To define an instance of a CS course:
   * DesiredDegreeInstances.define({ degreeSlug: 'bs-cs',
   *                                 semester: 'Spring-2016',
   *                                 coursesPerSemester: [2, 2, 2, 2, 2, 2, 2, 2],
   *                                 courseList: ['ics111', 'ics141', 'ics211', 'ics241', 'ics311',
    *                                 'ics314', 'ics212', 'ics321', ['ics313', 'ics361'], ['ics312', 'ics331'],
     *                                 'ics332', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx'] });
   * @param degreeSlug
   * @param startSemesterID
   * @param coursesPerSemester
   * @param courseList
   * @param endSemesterID
   * @returns {*}
   */
  define({ degreeSlug, semester, coursesPerSemester, courseList, endSemester = null }) {
    const degreeID = Slugs.getEntityID(degreeSlug, 'DesiredDegree');
    const startSemesterID = Semesters.getID(semester);
    const doc = this._collection.findOne({ degreeID, startSemesterID });
    console.log(doc);
    let endSemesterID;
    if (endSemester) {
      endSemesterID = Semesters.getID(endSemester);
    }
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({
      degreeID, startSemesterID, endSemesterID, coursesPerSemester, courseList,
    });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks degreeID, startSemesterID, endSemesterID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!DesiredDegrees.isDefined(doc.degreeID)) {
        problems.push(`Bad degreeID: ${doc.degreeID}`);
      }
      if (!Semesters.isDefined(doc.startSemesterID)) {
        problems.push(`Bad startSemesterID: ${doc.startSemesterID}`);
      }
      if (doc.endSemesterID && !Semesters.isDefined(doc.endSemesterID)) {
        problems.push(`Bad endSemesterID: ${doc.semesterID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the DesiredDegreeInstance docID in a format acceptable to define().
   * @param docID The docID of a DesiredDegreeInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    console.log(doc);
    const degreeSlug = Slugs.getNameFromID(doc.degreeID);
    const semester = Slugs.getNameFromID(doc.startSemesterID);
    const coursesPerSemester = doc.coursesPerSemester;
    const courseList = doc.courseList;
    let endSemester;
    if (doc.endSemesterID) {
      endSemester = Slugs.getNameFromID(doc.endSemesterID);
    }
    return { degreeSlug, semester, coursesPerSemester, courseList, endSemester };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const DesiredDegreeInstances = new DesiredDegreeInstanceCollection();
radgradCollections.push(DesiredDegreeInstances);
