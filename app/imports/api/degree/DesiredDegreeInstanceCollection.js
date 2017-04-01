import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
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
      courseList: { type: [Object] }, // list of slugs or choices
    }));
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const DesiredDegreeInstances = new DesiredDegreeInstanceCollection();
radgradCollections.push(DesiredDegreeInstances);
