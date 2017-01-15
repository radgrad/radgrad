import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';


import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module MentorQuestions */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseCollection
 */
class MentorQuestionsCollection extends BaseCollection {
  // TODO: Should be called MentorQuestionCollection, not MentorQuestionsCollection.
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestions', new SimpleSchema({  // TODO: Should be called MentorQuestion.
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      approved: { type: Boolean },
    }));
  }

  /**
   * Defines a new MentorSpace question.
   * @param title the question.
   * @param slug A unique identifier for this question.
   * @param approved If the question is approved
   * @return { String } the docID of this question.
   */
  define({ title, slug, approved }) {
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
}

export const MentorQuestions = new MentorQuestionsCollection();
radgradCollections.push(MentorQuestions);

