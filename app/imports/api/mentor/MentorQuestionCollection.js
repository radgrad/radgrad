import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module MentorQuestions */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseInstanceCollection
 */
class MentorQuestionCollection extends BaseInstanceCollection {
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestion', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
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
  define({ title, slug, student, moderated = false, visible = false, moderatorComments }) {
    const studentID = Users.getID(student);
    let questionSlug = slug;
    if (!slug) {
      questionSlug = `question-${student}-${this._collection.find({ studentID }).fetch().length}`;
    }
    const slugID = Slugs.define({ name: questionSlug, entityName: this.getType() });
    const docID = this._collection.insert({ title, slugID, studentID, moderated, visible, moderatorComments });
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  getQuestions() {
    return this._collection.find({}).fetch().reverse();
  }

  /**
   * Updates the MentorQuestion's approved variable.
   * @param questionID The MentorQuestion ID.
   * @param approved The new approved value.
   */
  updateModerated(questionID, moderated, visible, moderatorComments) {
    this.assertDefined(questionID);
    this._collection.update({ _id: questionID },
        { $set: { moderated, visible, moderatorComments } });
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the MentorQuestion docID in a format acceptable to define().
   * @param docID The docID of a MentorQuestion.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const slug = Slugs.getNameFromID(doc.slugID);
    const approved = doc.approved;
    return { title, slug, approved };
  }
}

export const MentorQuestions = new MentorQuestionCollection();
radgradCollections.push(MentorQuestions);

