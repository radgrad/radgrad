import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { calcLevel, updateStudentLevel } from './LevelProcessor';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';

/** @module api/level/LevelProcessorMethods */

/**
 * The LevelProcessor calcLevel method name.
 * @type {string}
 */
export const calcLevelMethodName = 'LevelProcessor.calcLevel';

/**
 * The LevelProcessor calcLevel ValidatedMethod.
 */
export const calcLevelMethod = new ValidatedMethod({
  name: calcLevelMethodName,
  validate: new SimpleSchema({
    studentID: { type: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ studentID }) {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    calcLevel(studentID);
  },
});

/**
 * The LevelProcessor updateLevel method name.
 * @type {string}
 */
export const updateLevelMethodName = 'LevelProcessor.updateLevel';

/**
 * The LevelProcessor updateLevel ValidatedMethod.
 */
export const updateLevelMethod = new ValidatedMethod({
  name: updateLevelMethodName,
  validate: new SimpleSchema({
    studentID: { type: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ studentID }) {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    updateStudentLevel(studentID);
  },
});

export const updateAllStudentLevelsMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateAllStudentLevels',
  validate: null,
  run() {
    const students = Users.find({ roles: [ROLE.STUDENT] }).fetch();
    _.map(students, (student) => {
      updateStudentLevel(student._id);
    });
  },
});
