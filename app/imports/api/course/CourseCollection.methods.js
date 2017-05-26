import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Courses } from './CourseCollection';

/** @module api/career/CourseCollectionMethods */

/**
 * The name of the Courses define method.
 * @type {string}
 */
export const coursesDefineMethodName = 'Courses.define';

/**
 * The Validated method for defining career goals.
 */
export const coursesDefineMethod = new ValidatedMethod({
  name: coursesDefineMethodName,
  validate: new SimpleSchema({
    name: { type: String, optional: false },
    shortName: { type: String, optional: false },
    slug: { type: String, optional: false },
    number: { type: String, optional: false },
    description: { type: String, optional: false },
    creditHrs: { type: Number, optional: false },
    interests: { type: [String], optional: false },
    syllabus: { type: String, optional: true },
    prerequisites: { type: [String], optional: true },
  }).validator(),
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return Courses.define(courseDefn);
  },
});

/**
 * The name of the Courses update method.
 * @type {string}
 */
export const coursesUpdateMethodName = 'Courses.update';

/**
 * The ValidatedMethod for updating Courses.
 */
export const coursesUpdateMethod = new ValidatedMethod({
  name: coursesUpdateMethodName,
  validate: new SimpleSchema({
    name: { type: String },
    shortName: { type: String },
    number: { type: String },
    description: { type: String },
    creditHrs: { type: Number },
    interestIDs: { type: [SimpleSchema.RegEx.Id] },
    // Optional data
    syllabus: { type: String, optional: true },
    prerequisites: { type: [String], optional: true },
  }).validator(),
  run(goalUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return Courses.update(goalUpdate.id, { $set: goalUpdate });
  },
});

/**
 * The name of the Courses removeIt method.
 * @type {string}
 */
export const coursesRemoveItMethodName = 'Courses.removeIt';

/**
 * The ValidatedMethod for removing Courses.
 */
export const coursesRemoveItMethod = new ValidatedMethod({
  name: coursesRemoveItMethodName,
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return Courses.removeIt(removeArgs.id);
  },
});
