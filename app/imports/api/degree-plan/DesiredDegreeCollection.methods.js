import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DesiredDegrees } from './DesiredDegreeCollection';


/** @module api/degree-plan/DesiredDegreeCollectionMethods */

/**
 * The Validated method for defining DesiredDegrees.
 */
export const desiredDegreesDefineMethod = new ValidatedMethod({
  name: 'DesiredDegrees.define',
  validate: new SimpleSchema({
    degreeSlug: { type: String, optional: false },
    name: { type: String, optional: false },
    semester: { type: String, optional: false },
    coursesPerSemester: { type: [Number], optional: false },
    courseList: { type: [String], optional: true },
  }).validator(),
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define DesiredDegrees.');
    }
    return DesiredDegrees.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating DesiredDegrees.
 */
export const desiredDegreesUpdateMethod = new ValidatedMethod({
  name: 'DesiredDegrees.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    degreeID: { type: SimpleSchema.RegEx.Id },
    name: { type: String },
    effectiveSemesterID: { type: SimpleSchema.RegEx.Id },
    coursesPerSemester: { type: [Number], minCount: 12, maxCount: 12 },
    courseList: { type: [String] },
  }).validator(),
  run(planUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update DesiredDegrees.');
    }
    return DesiredDegrees.update(planUpdate.id, { $set: planUpdate });
  },
});

/**
 * The ValidatedMethod for removing DesiredDegrees.
 */
export const desiredDegreesRemoveItMethod = new ValidatedMethod({
  name: 'DesiredDegrees.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete DesiredDegrees.');
    }
    return DesiredDegrees.removeIt(removeArgs.id);
  },
});
