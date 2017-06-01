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
  validate: null,
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
  validate: null,
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
  validate: null,
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
  validate: null,
  run(args) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Course Instances.');
    }
    CourseInstances.updateGrade(args.courseInstanceID, args.grade);
  },
});
