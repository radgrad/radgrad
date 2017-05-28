import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Courses } from './CourseCollection';

/** @module api/career/CourseCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const coursesDefineMethod = new ValidatedMethod({
  name: 'Courses.define',
  validate: new SimpleSchema({
    name: { type: String, optional: false },
    slug: { type: String, optional: false },
    number: { type: String, optional: false },
    description: { type: String, optional: false },
    creditHrs: { type: Number, optional: false, defaultValue: 3 },
    interests: { type: [String], optional: false, minCount: 1 },
    shortName: { type: String, optional: true },
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
 * The ValidatedMethod for updating Courses.
 */
export const coursesUpdateMethod = new ValidatedMethod({
  name: 'Courses.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
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
 * The ValidatedMethod for removing Courses.
 */
export const coursesRemoveItMethod = new ValidatedMethod({
  name: 'Courses.removeIt',
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
