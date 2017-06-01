import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Courses } from './CourseCollection';
import { ROLE } from '../role/Role';

/** @module api/career/CourseCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const coursesDefineMethod = new ValidatedMethod({
  name: 'Courses.define',
  validate: null,
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Courses.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Courses.');
      }
    return Courses.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating Courses.
 */
export const coursesUpdateMethod = new ValidatedMethod({
  name: 'Courses.update',
  validate: null,
  run(goalUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Courses.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Courses.');
      }
    return Courses.update(goalUpdate.id, { $set: goalUpdate });
  },
});

/**
 * The ValidatedMethod for removing Courses.
 */
export const coursesRemoveItMethod = new ValidatedMethod({
  name: 'Courses.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove Courses.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove Courses.');
      }
    return Courses.removeIt(removeArgs.id);
  },
});
