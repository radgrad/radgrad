import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
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
      approved: { type: Boolean },
    }));
  }

  /**
   * Defines a new MentorSpace question.
   * @param title the question.
   * @param slug A unique identifier for this question.
   * @param approved If the question is approved. Defaults to false.
   * @return { String } the docID of this question.
   */
  define({ title, slug, approved = false }) {
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this._collection.insert({ title, slugID, approved });
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  getQuestions() {
    return this._collection.find({}).fetch().reverse();
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

