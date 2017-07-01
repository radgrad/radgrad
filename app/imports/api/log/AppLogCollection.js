import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import { Roles } from 'meteor/alanning:roles';
import { Logger } from 'meteor/ostrio:logger';
import { LoggerMongo } from 'meteor/ostrio:loggermongo';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

/** @module api/log/AppLogCollection */

/**
 * Represents a log of an App talking to a Student.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class AppLogCollection extends BaseCollection {

  /**
   * Creates the AppLog collection.
   */
  constructor() {
    super('AppLog', new SimpleSchema({
      userId: {
        type: String,
      },
      date: {
        type: Date,
      },
      timestamp: {
        type: Number,
      },
      level: {
        type: String,
      },
      message: {
        type: String,
      },
      additional: {
        type: Object,
      },
    }));
  }

  /**
   * Returns the underlying Mongo.Collection. Needed for LoggerMongo.
   * @returns {Mongo.Collection}
   */
  getCollection() {
    return this._collection;
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
