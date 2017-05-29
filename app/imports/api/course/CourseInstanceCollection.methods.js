import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CourseInstances } from './CourseInstanceCollection';


/** @module api/course/CourseInstanceCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const courseInstancesDefineMethod = new ValidatedMethod({
  name: 'CourseInstances.define',
  validate: new SimpleSchema({
    semester: { type: String, optional: false },
    course: { type: String, optional: false },
    fromSTAR: { type: Boolean, optional: false },
    grade: { type: String, optional: false },
    student: { type: String, optional: false },
    verified: { type: Boolean, optional: true },
    note: { type: String, optional: true },
    creditHrs: { type: Number, optional: true },
  }).validator(),
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define CourseInstances.');
    }
    return CourseInstances.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating CourseInstances.
 */
export const courseInstancesUpdateMethod = new ValidatedMethod({
  name: 'CourseInstances.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    semesterID: { type: SimpleSchema.RegEx.Id },
    courseID: { type: SimpleSchema.RegEx.Id, optional: true },
    verified: { type: Boolean },
    fromSTAR: { type: Boolean, optional: true },
    grade: { type: String, optional: true },
    creditHrs: { type: Number },
    note: { type: String, optional: true },
    studentID: { type: SimpleSchema.RegEx.Id },
    ice: { type: Object, optional: true, blackbox: true },
  }).validator(),
  run(instanceUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update CourseInstances.');
    }
    return CourseInstances.update(instanceUpdate.id, { $set: instanceUpdate });
  },
});

/**
 * The ValidatedMethod for removing CourseInstances.
 */
export const courseInstancesRemoveItMethod = new ValidatedMethod({
  name: 'CourseInstances.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete CourseInstances.');
    }
    return CourseInstances.removeIt(removeArgs.id);
  },
});

/**
 * CourseInstance update grade ValidatedMethod.
 */
export const courseInstanceUpdateGradeMethod = new ValidatedMethod({
  name: 'CourseInstance.updateGrade',
  validate: new SimpleSchema({
    courseInstanceID: { type: SimpleSchema.RegEx.Id },
    grade: { type: String },
  }).validator(),
  run(args) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update grades.');
    }
    CourseInstances.updateGrade(args.courseInstanceID, args.grade);
  },
});
