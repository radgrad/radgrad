/**
 * Created by Cam Moore on 12/10/16.
 */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '../user/UserCollection';

/** @module HelpInstance */

/**
 * Represents the taking of a course by a specific student in a specific semester.
 * @extends module:Base~BaseCollection
 */
class HelpInstanceCollection extends BaseCollection {
  /**
   * Creates the HelpInstance collection.
   */
  constructor() {
    super('HelpInstance', new SimpleSchema({
      routeName: { type: String },
      studentID: { type: SimpleSchema.RegEx.id },
      show: { type: Boolean },
    }));
  }

  /**
   * Turns off the Help for the given route and student.
   * @param routeName The route name.
   * @param studentID The student's id.
   */
  define({ routeName, studentID }) {
    Users.assertDefined(studentID);
    const doc = this._collection.find({ routeName, studentID }).fetch();
    if (doc.length > 0) {
      return doc[0]._id;
    }
    return this._collection.insert({ routeName, studentID, show: false });
  }

  /**
   * Returns the HelpInstance for the given route and student.
   * @param routeName the route name.
   * @param studentID the student ID.
   * @returns {any}
   */
  findOne(routeName, studentID) {
    return this._collection.findOne({ routeName, studentID });
  }

  /**
   * Removes all the instances for the given studentID. This resets all their choices.
   * @param studentID the student ID.
   */
  resetChoice(studentID) {
    const collection = this._collection;
    const instances = collection.find({ studentID }).fetch();
    instances.forEach(function del(instance) {
      collection.remove({ _id: instance._id });
    });
  }
}

export const HelpInstances = new HelpInstanceCollection();
