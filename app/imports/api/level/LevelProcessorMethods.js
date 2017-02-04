import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { calcLevel, updateStudentLevel } from './LevelProcessor';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';

export const calcLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.calcLevel',
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

export const updateLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateLevel',
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
