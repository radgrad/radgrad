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
    year: { type: Number, optional: false },
    student: { type: String, optional: false },
  }).validator(),
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define AcademicYearInstances.');
    }
    return AcademicYearInstances.define(definition);
  },
});

/**
 * The ValidatedMethod for updating AcademicYearInstances.
 */
export const academicYearInstancesUpdateMethod = new ValidatedMethod({
  name: 'AcademicYearInstances.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    year: { type: Number },
    springYear: { type: Number },
    studentID: { type: SimpleSchema.RegEx.Id },
    semesterIDs: { type: [SimpleSchema.RegEx.Id] },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update AcademicYearInstances.');
    }
    return AcademicYearInstances.update(update.id, { $set: update });
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

