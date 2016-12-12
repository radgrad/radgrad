/**
 * Created by Cam Moore on 12/12/16.
 */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CourseInstances } from './CourseInstanceCollection';

export const updateGrade = new ValidatedMethod({
  name: 'CourseInstance.updateGrade',
  validate: new SimpleSchema({
    courseInstanceID: { type: SimpleSchema.RegEx.Id },
    grade: { type: String },
  }).validator(),
  run(args) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    }
    CourseInstances.updateGrade(args.courseInstanceID, args.grade);
  },
});
