import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import BaseInstanceCollection from '../base/BaseInstanceCollection';
import { radgradCollections } from '../base/RadGradCollections';

/** @module api/mentor/MentorQuestionCollection */

/**
 * Represents a mentor answer.
 * @extends module:api/base/BaseInstanceCollection~BaseInstanceCollection
 */
class MentorQuestionCollection extends BaseInstanceCollection {
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestion', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new MentorSpace question.
   * @param title the question.
   * @param slug A unique identifier for this question.
   * @param student The student that asked this question.
   * @param moderated If the question is moderated. Defaults to false.
   * @param visible If the question is visible. Defaults to false.
   * @return { String } the docID of this question.
   */
  define({ title, slug, student, moderated = false, visible = false, moderatorComments = '' }) {
    const studentID = Users.getID(student);
    let slugID;
    if (slug) {
      slugID = Slugs.define({ name: slug, entityName: this.getType() });
    }
    const docID = this._collection.insert({ title, slugID, studentID, moderated, visible, moderatorComments });
    if (slug) {
      Slugs.updateEntityID(slugID, docID);
    }
    return docID;
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
   * Updates the MentorQuestion's title, visible, and moderated variables.
   * @param questionID The MentorQuestion ID.
   * @param title The new title value.
   */
  updateQuestion(questionID, title) {
    this.assertDefined(questionID);
    this._collection.update({ _id: questionID },
        { $set: { title, moderated: false, visible: false } });
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

  /**
   * Removes the passed MentorQuestion and its associated Slug.
   * @param opportunity The document or _id associated with this MentorQuestion.
   * @throws {Meteor.Error} If MentorQuestion is not defined.
   */
  removeIt(question) {
    console.log(this.findDoc(question).slugID);
    if (this.findDoc(question).slugID) {
      super.removeIt(question);
    } else {
      super.removeItNoSlug(question);
    }
  }

  /**
   * Returns an object representing the MentorQuestion docID in a format acceptable to define().
   * @param docID The docID of a MentorQuestion.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    let slug;
    if (doc.slugID) {
      slug = Slugs.getNameFromID(doc.slugID);
    }
    const student = Users.findSlugByID(doc.studentID);
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;
    return { title, slug, student, moderated, visible, moderatorComments };
  }
}

export const MentorQuestions = new MentorQuestionCollection();
radgradCollections.push(MentorQuestions);

