import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module api/help/HelpMessageCollection */

/**
 * Represents a Help message for a RadGrad page.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class HelpMessageCollection extends BaseCollection {
  /**
   * Creates the AdvisorLog collection.
   */
  constructor() {
    super('HelpMessage', new SimpleSchema({
      routeName: { type: String },
      title: { type: String },
      text: { type: String },
    }));
  }

  /**
   * Defines the help for a given routeName.
   * @param routeName the route name.
   * @param title the title of the help.
   * @param text the help text.
   * @return {any} the ID of the help.
   */
  define({ routeName, title, text }) {
    return this._collection.insert({ routeName, title, text });
  }

  /**
   * Returns the text for the given routeName.
   * @param routeName
   */
  getHelpText(routeName) {
    return this._collection.findOne({ routeName }).text;
  }

  /**
   * Returns the title for the given routeName.
   * @param routeName
   */
  getHelpTitle(routeName) {
    return this._collection.findOne({ routeName }).title;
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    return [];
  }

  /**
   * Returns an object representing the HelpMessage docID in a format acceptable to define().
   * @param docID The docID of a HelpMessage.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const routeName = doc.routeName;
    const title = doc.title;
    const text = doc.text;
    return { routeName, title, text };
  }
}

export const HelpMessages = new HelpMessageCollection();
radgradCollections.push(HelpMessages);

