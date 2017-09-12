import { Meteor } from 'meteor/meteor';
import { Logger } from 'meteor/ostrio:logger';
import { Roles } from 'meteor/alanning:roles';
import { LoggerMongo } from 'meteor/ostrio:loggermongo';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';


/**
 * Represents a log of user interaction with RadGrad.
 * @extends api/base.BaseCollection
 * @memberOf api/log
 */
class AppLogCollection extends BaseCollection {

  /**
   * Creates the AppLog collection.
   */
  constructor() {
    super('AppLog', new SimpleSchema({
      userId: String,
      date: Date,
      timestamp: Number,
      level: String,
      message: String,
      additional: Object,
    }));
  }

  /**
   * Returns the underlying Mongo.Collection. Needed for LoggerMongo.
   * @returns {Mongo.Collection}
   */
  getCollection() {
    return this._collection;
  }

  /**
   * Only publish the log data if the user is the ADMIN.
   */
  publish() {
    if (Meteor.isServer) {
      // Meteor.publish(this._collectionName, () => this._collection.find());
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        return (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) ? instance._collection.find() : [];
      });
    }
  }

  /**
   * Returns an object representing the AppLog docID.
   * Currently returns null to disable dump/restore of these logs.
   * @param docID The docID of a AppLog.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    // const doc = this.findDoc(docID);
    // const userId = doc.userId;
    // const date = doc.date;
    // const timestamp = doc.timestamp;
    // const level = doc.level;
    // const message = doc.message;
    // const additional = doc.additional;
    // return { userId, date, timestamp, level, message, additional };
    return null;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * No problems checked for at present.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    return problems;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/log.AppLogCollection}
 * @memberOf api/log
 */
export const AppLogs = new AppLogCollection();

// Initialize Logger:
export const appLog = new Logger();
// Initialize LoggerMongo with collection instance:
const LogMongo = new LoggerMongo(appLog, {
  collection: AppLogs.getCollection(),
});
// Enable LoggerMongo
if (!Meteor.settings.public.appLogging) {
  // console.log('App logging default settings');
  LogMongo.enable();
} else {
  // console.log('App logging with', Meteor.settings.public.appLogging);
  LogMongo.enable(Meteor.settings.public.appLogging);
}

if (Meteor.isServer) {
  LogMongo.collection._ensureIndex({ level: 1 }, { background: true });
  LogMongo.collection._ensureIndex({ userId: 1 }, { background: true });
  LogMongo.collection._ensureIndex({ date: 1 }, { background: true });
  LogMongo.collection._ensureIndex({ timestamp: 1 }, { background: true });
}
