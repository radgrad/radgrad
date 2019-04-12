import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';


/**
 * Represents a Help message for a RadGrad page.
 * @extends api/base.BaseCollection
 * @memberOf api/help
 */
class HelpMessageCollection extends BaseCollection {
  /**
   * Creates the HelpMessage collection.
   */
  constructor() {
    super('HelpMessage', new SimpleSchema({
      routeName: { type: String },
      title: { type: String },
      text: { type: String },
      retired: { type: Boolean, optional: true },
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
   * Update a Help Message
   * @param docID The docID to be updated.
   * @param routeName The new routeName (optional).
   * @param title The new title (optional)
   * @param text New help text. (optional).
   * @throws { Meteor.Error } If docID is not defined.
   */
  update(docID, { routeName, title, text, retired }) {
    this.assertDefined(docID);
    const updateData = {};
    if (routeName) {
      updateData.routeName = routeName;
    }
    if (title) {
      updateData.title = title;
    }
    if (text) {
      updateData.text = text;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Help Message..
   * @param docID The docID of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Help Message.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Returns the text for the given routeName.
   * @param routeName The route name.
   */
  getHelpText(routeName) {
    return this._collection.findOne({ routeName }).text;
  }

  /**
   * Returns the title for the given routeName.
   * @param routeName The route name.
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
   * Returns the HelpMessage doc associated with RouteName.
   * @param routeName The routeName
   * @returns The doc, or null if not found.
   */
  findDocByRouteName(routeName) {
    return this._collection.findOne({ routeName });
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

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/help
 * @type {api/help.HelpMessageCollection}
 */
export const HelpMessages = new HelpMessageCollection();
