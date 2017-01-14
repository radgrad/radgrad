import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';

/** @module MentorQuestions */

/**
 * Represents a mentor answer.
 * @extends module:Base~BaseCollection
 */
class MentorQuestionsCollection extends BaseCollection {
  /**
   * Creates the Mentor Question collection.
   */
  constructor() {
    super('MentorQuestions', new SimpleSchema({
      title: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  /**
   * Defines the question for a given question ID.
   * @param title the question.
   * @param slug
   * @return {any} the ID of the question.
   */
  define({ title, slug }) {
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const docID = this._collection.insert({ title, slugID });
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }

  getQuestions() {
    return this._collection.find({});
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
      _.forEach(doc.interestIDs, interestID => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
    });
    return problems;
  }
}

export const MentorQuestions = new MentorQuestionsCollection();
radgradCollections.push(MentorQuestions);

