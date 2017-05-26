import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CourseInstances } from './CourseInstanceCollection';

/** @module api/course/CourseInstanceCollectionMethods */

/**
 * CourseInstance.updateGrade Validated method name.
 */
export const courseInstanceUpdateGradeMethodName = 'CourseInstance.updateGrade';

/**
 * CourseInstance update grade ValidatedMethod.
 */
export const courseInstanceUpdateGradeMethod = new ValidatedMethod({
  name: courseInstanceUpdateGradeMethodName,
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
