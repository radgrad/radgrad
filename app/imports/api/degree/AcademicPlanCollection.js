import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
// import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/** @module AcademicPlan */

class AcademicPlanCollection extends BaseInstanceCollection {

  constructor() {
    super('AcademicPlanCollection', new SimpleSchema({
      degreeID: { type: SimpleSchema.RegEx.Id },
      effectiveSemesterID: { type: SimpleSchema.RegEx.Id },
      coursesPerSemester: { type: [Number] },
      courseList: { type: [Object] },
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
}

export const AcademicPlans = new AcademicPlanCollection();
// radgradCollections.push(AcademicPlanCollection);
