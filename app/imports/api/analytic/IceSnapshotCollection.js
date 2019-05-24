import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';

/**
 * Represents a snapshot of a student's ICE points and their level. Used to check if a student
 * has leveled up and/or achieved 100 ICE points (complete plan).
 * @extends api/base.BaseCollection
 * @memberOf api/analytic
 */
class IceSnapshotCollection extends BaseCollection {

  /**
   * Creates the IceSnapshot collection.
   */
  constructor() {
    super('IceSnapshot', new SimpleSchema({
      username: { type: String },
      level: { type: Number },
      i: { type: Number },
      c: { type: Number },
      e: { type: Number },
      updated: { type: Date },
    }));
  }

  /**
   * Defines a snapshot of a Student's level and ICE.
   * @param username The student's username.
   * @param level The student's current level.
   * @param i The student's current innovation points.
   * @param c The student's current competency points.
   * @param e The student's current experience points.
   * @param updated Timestamp of most recent snapshot.
   */
  define({ username, level, i, c, e, updated }) {
    return this._collection.insert({ username, level, i, c, e, updated });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.username)) {
        problems.push(`Bad user: ${doc.username}`);
      } else if (this.find({ username: doc.username }).count() > 1) {
        problems.push(`More than one document found for user: ${doc.username}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the IceSnapshotCollection docID in a format acceptable to define().
   * @param docID The docID of a IceSnapshot.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const updated = doc.updated;
    const level = doc.level;
    const i = doc.i;
    const c = doc.c;
    const e = doc.e;
    return { username, level, i, c, e, updated };
  }

  /**
   * Publish an empty cursor to IceSnapshotCollection. We do not need to publish any records,
   * but would still like this to be on the list of collections for integrity check, etc.
   */
  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, () => this._collection.find({}, { limit: 0 }));
    }
  }
}

export const IceSnapshots = new IceSnapshotCollection();
