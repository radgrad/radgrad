import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { updateStudentLevel, updateAllStudentLevels, defaultCalcLevel } from './LevelProcessor';
import { ROLE } from '../role/Role';
import { RadGrad } from '../radgrad/RadGrad';

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
    if (RadGrad.calcLevel) {
      return RadGrad.calcLevel(studentID);
    }
    return defaultCalcLevel(studentID);
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
    updateStudentLevel(this.userId, studentID);
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
