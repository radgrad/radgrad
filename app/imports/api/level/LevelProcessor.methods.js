import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { updateStudentLevel, updateAllStudentLevels } from './LevelProcessor';
import { calcLevel } from './calcLevel';
import { ROLE } from '../role/Role';

/**
 * The LevelProcessor calcLevel ValidatedMethod.
 * @memberOf api/level
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
 * @memberOf api/level
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
 * @memberOf api/level
 */
export const updateAllStudentLevelsMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateAllStudentLevels',
  validate: null,
  run() {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    const count = updateAllStudentLevels(this.userId);
    return `Updated ${count} students' levels.`;
  },
});
