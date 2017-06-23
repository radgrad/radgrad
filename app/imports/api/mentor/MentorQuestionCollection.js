import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';

/** @module api/mentor/MentorQuestionCollection */

/**
 * Represents a mentor answer.
 * @extends module:api/base/BaseSlugCollection~BaseSlugCollection
 */
class MentorQuestionCollection extends BaseSlugCollection {
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestion', new SimpleSchema({
      question: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new MentorSpace question.
   * @param question the question.
   * @param slug A unique identifier for this question.
   * @param student The student that asked this question.
   * @param moderated If the question is moderated. Defaults to false.
   * @param visible If the question is visible. Defaults to false.
   * @return { String } the docID of this question.
   */
  define({ question, slug, student, moderated = false, visible = false, moderatorComments = '' }) {
    const studentID = Users.getID(student);
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this._collection.insert({ question, slugID, studentID, moderated, visible, moderatorComments });
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  getQuestions() {
    return this._collection.find({}).fetch().reverse();
  }

  /**
   * Updates the MentorQuestion's moderated, visible, and moderatorComments variable.
   * @param questionID The MentorQuestion ID.
   * @param moderated The new moderated value.
   * @param visible The new visible value.
   * @param moderatorComments The new moderatorComments value.
   */
  updateModerated(questionID, moderated, visible, moderatorComments) {
    this.assertDefined(questionID);
    this._collection.update({ _id: questionID },
        { $set: { moderated, visible, moderatorComments } });
  }

  /**
   * Updates the MentorQuestion's slug variable, if the slug has not been defined yet.
   * @param questionID The MentorQuestion ID.
   * @param slug The new slug value.
   */
  updateSlug(questionID, slug) {
    this.assertDefined(questionID);
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    this._collection.update({ _id: questionID },
        { $set: { slugID } });
  }

  /**
   * Updates the MentorQuestion's question, visible, and moderated variables.
   * @param questionID The MentorQuestion ID.
   * @param question The new question value.
   */
  updateQuestion(questionID, question) {
    this.assertDefined(questionID);
    this._collection.update({ _id: questionID },
        { $set: { question, moderated: false, visible: false } });
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (doc.slugID) {
        if (!Slugs.isDefined(doc.slugID)) {
          problems.push(`Bad slugID: ${doc.slugID}`);
        }
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
    });
    return problems;
  }

  // TODO: removeItNoSlug should not exist in BaseSlugCollection, so I've removed it.
  // This class should be able to us the default removeIt inherited from the superclass.

  // /**
  //  * Removes the passed MentorQuestion and its associated Slug.
  //  * @param opportunity The document or _id associated with this MentorQuestion.
  //  * @throws {Meteor.Error} If MentorQuestion is not defined.
  //  */
  // removeIt(question) {
  //   if (this.findDoc(question).slugID) {
  //     super.removeIt(question);
  //   } else {
  //     super.removeItNoSlug(question);
  //   }
  // }

  /**
   * Returns an object representing the MentorQuestion docID in a format acceptable to define().
   * @param docID The docID of a MentorQuestion.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const question = doc.question;
    let slug;
    if (doc.slugID) {
      slug = Slugs.getNameFromID(doc.slugID);
    }
    const student = Users.findSlugByID(doc.studentID);
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;
    return { question, slug, student, moderated, visible, moderatorComments };
  }
}

export const MentorQuestions = new MentorQuestionCollection();

