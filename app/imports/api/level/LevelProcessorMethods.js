import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { calcLevel, updateStudentLevel } from './LevelProcessor';


export const calcLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.calcLevel',
  validate: new SimpleSchema({
    studentID: { type: SimpleSchema.RegEx.Id },
  }).validator(),
  run(args) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
    }
    calcLevel(args.studentID);
  },
});

export const updateLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateLevel',
  validate: new SimpleSchema({
    studentID: { type: SimpleSchema.RegEx.Id },
  }).validator(),
  run(args) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
    }
    updateStudentLevel(args.studentID);
  },
});
