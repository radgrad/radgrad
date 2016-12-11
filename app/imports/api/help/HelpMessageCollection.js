/**
 * Created by Cam on 12/7/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '../user/UserCollection';

/** @module Help */

/**
 * Represents a Help message for a RadGrad page.
 * @extends module:Base~BaseCollection
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
    }), new SimpleSchema({
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
}

export const HelpMessages = new HelpMessageCollection();
