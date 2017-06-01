import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { calcLevel, updateStudentLevel } from './LevelProcessor';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';

/** @module api/level/LevelProcessorMethods */

/**
 * The LevelProcessor calcLevel ValidatedMethod.
 */
export const calcLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.calcLevel',
  validate: null,
  run({ studentID }) {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    calcLevel(studentID);
  },
});

/**
 * The LevelProcessor updateLevel ValidatedMethod.
 */
export const updateLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateLevel',
  validate: null,
  run({ studentID }) {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    updateStudentLevel(studentID);
  },
});

/**
 * The LevelProcessor update all students' level validated method.
 */
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
