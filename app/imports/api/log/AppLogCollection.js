import { Logger } from 'meteor/ostrio:logger';
import { LoggerMongo } from 'meteor/ostrio:loggermongo';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

/** @module api/log/AppLogCollection */

/**
 * Represents a log of user interaction with RadGrad.
 * @extends module:api/base/BaseCollection~BaseCollection
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
   * Returns an object representing the AppLog docID.
   * @param docID The docID of a AppLog.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const userId = doc.userId;
    const date = doc.date;
    const timestamp = doc.timestamp;
    const level = doc.level;
    const message = doc.message;
    const additional = doc.additional;
    return { userId, date, timestamp, level, message, additional };
  }

}

export const AppLogs = new AppLogCollection();

// Initialize Logger:
export const log = new Logger();
// Initialize LoggerMongo with collection instance:
const LogMongo = new LoggerMongo(log, {
  collection: AppLogs.getCollection(),
});
// Enable LoggerMongo with default settings:
LogMongo.enable();
