import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../role/Role';


/**
 * BaseCollection is an abstract superclass of all RadGrad data model entities.
 * It is the direct superclass for SlugCollection and SemesterCollection.
 * Other collection classes are derived from BaseSlugCollection or BaseTypeCollection, which are abstract
 * classes that inherit from this one.
 * @memberOf api/base
 */
class BaseCollection {
  /**
   * Superclass constructor for all RadGrad entities.
   * Defines internal fields needed by all entities: _type, _collectionName, _collection, and _schema.
   * @param {String} type The name of the entity defined by the subclass.
   * @param {SimpleSchema} schema The schema for validating fields on insertion to the DB.
   */
  constructor(type, schema) {
    this._type = type;
    this._collectionName = `${type}Collection`;
    this._collection = new Mongo.Collection(`${type}Collection`);
    this._schema = schema;
    this._collection.attachSchema(this._schema);
  }

  /**
   * Returns the number of documents in this collection.
   * @returns { Number } The number of elements in this collection.
   */
  count() {
    return this._collection.find()
      .count();
  }

  /**
   * Returns the number of non-retired documents in this collection.
   * @returns { Number } The number of non-retired elements in this collection.
   */
  countNonRetired() {
    return _.filter(this._collection.find()
      .fetch(), doc => !doc.retired).length;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection.
   */
  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, () => this._collection.find());
    }
  }

  /**
   * Default subscription method for entities.
   * It subscribes to the entire collection.
   */
  subscribe() {
    if (Meteor.isClient) {
      Meteor.subscribe(this._collectionName);
    }
  }

  /**
   * A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.
   * @param { String | Object } name Either the docID, or an object selector, or the 'name' field value.
   * @returns { Object } The document associated with name.
   * @throws { Meteor.Error } If the document cannot be found.
   */
  findDoc(name) {
    const doc = (
      this._collection.findOne(name)
      || this._collection.findOne({ name })
      || this._collection.findOne({ _id: name })
      || this._collection.findOne({ username: name }));
    if (!doc) {
      if (typeof name !== 'string') {
        throw new Meteor.Error(`${JSON.stringify(name)} is not a defined ${this._type}`, '', Error().stack);
      } else {
        throw new Meteor.Error(`${name} is not a defined ${this._type}`, '', Error().stack);
      }
    }
    return doc;
  }

  /**
   * Runs find on this collection.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns {Mongo.Cursor}
   */
  find(selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return this._collection.find(theSelector, options);
  }

  /**
   * Runs find on this collection and returns the non-retired documents.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param selector { Object } A MongoDB selector.
   * @param options { Object } MongoDB options.
   * @returns { Array } non-retired documents.
   */
  findNonRetired(selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return _.filter(this._collection.find(theSelector, options)
      .fetch(), doc => !doc.retired);
  }

  /**
   * Runs findOne on this collection.
   * @see {@link http://docs.meteor.com/#/full/findOne|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns {Mongo.Cursor}
   */
  findOne(selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    return this._collection.findOne(theSelector, options);
  }

  /**
   * Runs a simplified version of update on this collection.
   * @see {@link http://docs.meteor.com/api/collections.html#Mongo-Collection-update}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } modifier A MongoDB modifier
   * @returns true
   */
  update(selector, modifier) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    this._collection.update(theSelector, modifier);
    return true;
  }

  /**
   * Returns true if the passed entity is in this collection.
   * @param { String | Object } name The docID, or an object specifying a documennt.
   * @returns {boolean} True if name exists in this collection.
   */
  isDefined(name) {
    if (_.isUndefined(name)) {
      return false;
    }
    return (
      !!this._collection.findOne(name)
      || !!this._collection.findOne({ name })
      || !!this._collection.findOne({ _id: name }));
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    // console.log('%o.removeIt(%o)', this._collectionName, name);
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Removes all elements of this collection.
   * This is implemented by mapping through all elements because mini-mongo does not implement the remove operation.
   * So this approach can be used on both client and server side.
   * removeAll should only used for testing purposes, so it doesn't need to be efficient.
   * @returns true
   */
  removeAll() {
    const items = this._collection.find()
      .fetch();
    const instance = this;
    _.forEach(items, (i) => {
      instance.removeIt(i._id);
    });
    return true;
  }

  /**
   * Return the type of this collection.
   * @returns { String } The type, as a string.
   */
  getType() {
    return this._type;
  }

  /**
   * Return the publication name.
   * @returns { String } The publication name, as a string.
   */
  getPublicationName() {
    return this._collectionName;
  }

  /**
   * Returns the collection name.
   * @return {string} The collection name as a string.
   */
  getCollectionName() {
    return this._collectionName;
  }

  /**
   * Returns a string representing all of the documents in this collection.
   * @returns {String}
   */
  toString() {
    return this._collection.find()
      .fetch();
  }

  /**
   * Verifies that the passed object is one of this collection's instances.
   * @param { String | List } name Should be a defined ID or doc in this collection.
   * @throws { Meteor.Error } If not defined.
   */
  assertDefined(name) {
    if (!this.isDefined(name)) {
      throw new Meteor.Error(`${name} is not a valid instance of ${this._type}.`, '', Error().stack);
    }
  }

  /**
   * Verifies that the list of passed instances are all members of this collection.
   * @param names Should be a list of docs and/or docIDs.
   * @throws { Meteor.Error } If instances is not an array, or if any instance is not in this collection.
   */
  assertAllDefined(names) {
    if (!_.isArray(names)) {
      throw new Meteor.Error(`${names} is not an array.`, '', Error().stack);
    }
    names.map(name => this.assertDefined(name));
  }

  /**
   * Internal helper function to simplify definition of the assertValidRoleForMethod method.
   * @param userId The userID.
   * @param roles An array of roles.
   * @throws { Meteor.Error } If userId is not defined or user is not in the specified roles.
   * @returns True if no error is thrown.
   * @ignore
   */
  _assertRole(userId, roles) { // eslint-disable-line class-methods-use-this
    if (!userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in.', '', Error().stack);
    } else if (!Roles.userIsInRole(userId, roles)) {
      throw new Meteor.Error('unauthorized', `You must be one of the following roles: ${roles}`, '', Error().stack);
    }
    return true;
  }

  /**
   * Internal helper function to simplify definition of the updateData for updateMethod.
   * @param userId The userID.
   * @param roles An array of roles.
   * @returns true if the user is in the roles, false otherwise.
   * @ignore
   */
  _hasRole(userId, roles) { // eslint-disable-line class-methods-use-this
    if (!userId) {
      return false;
    }
    return Roles.userIsInRole(userId, roles);
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR]);
  }

  /**
   * Define the default integrity checker for all applications.
   * Returns an array with a string indicating that this method is not overridden.
   * @returns { array } An array containing a string indicating the use of the default integrity checker.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    return ['There is no integrity checker defined for this collection.'];
  }

  /**
   * Returns an object with two fields: name and contents.
   * Name is the name of this collection.
   * Contents is an array of objects suitable for passing to the restore() method.
   * @returns {Object} An object representing the contents of this collection.
   */
  dumpAll() {
    const dumpObject = {
      name: this._collectionName,
      contents: this.find()
        .map(docID => this.dumpOne(docID)),
    };
    // If a collection doesn't want to be dumped, it can just return null from dumpOne.
    dumpObject.contents = _.without(dumpObject.contents, null);
    // sort the contents array by slug (if present)
    if (dumpObject.contents[0] && dumpObject.contents[0].slug) {
      dumpObject.contents = _.sortBy(dumpObject.contents, obj => obj.slug);
    }
    return dumpObject;
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne function.
   * Must be overridden by each collection.
   * @param docID A docID from this collection.
   * @returns { Object } An object representing this document.
   */
  dumpOne(docID) { // eslint-disable-line
    throw new Meteor.Error(`Default dumpOne method invoked by collection ${this._collectionName}`, '', Error().stack);
  }

  /**
   * Defines the entity represented by dumpObject.
   * Defaults to calling the define() method if it exists.
   * @param dumpObject An object representing one document in this collection.
   * @returns { String } The docID of the newly created document.
   */
  restoreOne(dumpObject) {
    if (typeof this.define === 'function') {
      return this.define(dumpObject);
    }
    return null;
  }

  /**
   * Defines all the entities in the passed array of objects.
   * @param dumpObjects The array of objects representing the definition of a document in this collection.
   */
  restoreAll(dumpObjects) {
    _.each(dumpObjects, dumpObject => this.restoreOne(dumpObject));
  }
}

/**
 * The BaseCollection used by all RadGrad entities.
 */
export default BaseCollection;
