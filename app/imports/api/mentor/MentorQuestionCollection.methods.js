import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { MentorQuestions } from './MentorQuestionCollection';
import { ROLE } from '../role/Role';

/** @module api/mentor/MentorQuestionCollectionMethods */

/**
 * The validated method for defining MentorQuestions.
 */
export const mentorQuestionsDefineMethod = new ValidatedMethod({
  name: 'MentorQuestions.define',
  validate: new SimpleSchema({
    title: { type: String },
    slug: { type: String, optional: true },
    student: { type: String },
    moderated: { type: Boolean, optional: true },
    visible: { type: Boolean, optional: true },
    moderatorComments: { type: String, optional: true },
  }).validator(),
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define MentorQuestions.');
    }
    return MentorQuestions.define(helpDefn);
  },
});

/**
 * The ValidatedMethod for updating MentorQuestions.
 */
export const mentorQuestionsUpdateMethod = new ValidatedMethod({
  name: 'MentorQuestions.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    title: { type: String },
    slugID: { type: SimpleSchema.RegEx.Id, optional: true },
    studentID: { type: SimpleSchema.RegEx.Id },
    moderated: { type: Boolean },
    visible: { type: Boolean },
    moderatorComments: { type: String, optional: true },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update MentorQuestions.');
    }
    return MentorQuestions.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for calling MentorQuestions.updateModerated.
 */
export const mentorQuestionsUpdateModeratedMethod = new ValidatedMethod({
  name: 'MentorQuestions.updateModerated',
  validate: new SimpleSchema({
    questionID: { type: SimpleSchema.RegEx.Id },
    moderated: { type: Boolean },
    visible: { type: Boolean },
    moderatorComments: { type: String },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update MentorQuestions.');
    }
    // eslint-disable-next-line
    return MentorQuestions.updateModerated(update.questionID, update.moderated, update.visible, update.moderatorComments);
  },
});

/**
 * The ValidatedMethod for calling MentorQuestions.updateSlug.
 */
export const mentorQuestionsUpdateSlugMethod = new ValidatedMethod({
  name: 'MentorQuestions.updateSlug',
  validate: new SimpleSchema({
    questionID: { type: SimpleSchema.RegEx.Id },
    slug: { type: String },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update MentorQuestions.');
    }
    // eslint-disable-next-line
    return MentorQuestions.updateSlug(update.questionID, update.slug);
  },
});

/**
 * The validated method for removing MentorQuestions.
 */
export const mentorQuestionsRemoveItMethod = new ValidatedMethod({
  name: 'MentorQuestions.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove MentorQuestions.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to remove MentorQuestions.');
      }
    return MentorQuestions.removeIt(removeArgs.id);
  },
});
