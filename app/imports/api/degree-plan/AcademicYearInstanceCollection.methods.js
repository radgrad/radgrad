import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';


/** @module api/degree-plan/AcademicYearInstanceCollectionMethods */

/**
 * The Validated method for defining AcademicYearInstances.
 */
export const academicYearInstancesDefineMethod = new ValidatedMethod({
  name: 'AcademicYearInstances.define',
  validate: new SimpleSchema({
    degreeSlug: { type: String, optional: false },
    name: { type: String, optional: false },
    semester: { type: String, optional: false },
    coursesPerSemester: { type: [Number], optional: false },
    courseList: { type: [String], optional: true },
  }).validator(),
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define AcademicYearInstances.');
    }
    return AcademicYearInstances.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating AcademicYearInstances.
 */
export const academicYearInstancesUpdateMethod = new ValidatedMethod({
  name: 'AcademicYearInstances.update',
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
      throw new Meteor.Error('unauthorized', 'You must be logged in to update AcademicYearInstances.');
    }
    return AcademicYearInstances.update(planUpdate.id, { $set: planUpdate });
  },
});

/**
 * The ValidatedMethod for removing AcademicYearInstances.
 */
export const academicYearInstancesRemoveItMethod = new ValidatedMethod({
  name: 'AcademicYearInstances.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete AcademicYearInstances.');
    }
    return AcademicYearInstances.removeIt(removeArgs.id);
  },
});

