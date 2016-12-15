import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module Base */

/**
 * BaseCollection is an abstract superclass of all RadGrad data model entities.
 * It is the direct superclass for SlugCollection and SemesterCollection.
 * Other collection classes are derived from BaseInstanceCollection or BaseTypeCollection, which are abstract
 * classes that inherit from this one.
 */
class BaseCollection {

  /**
   * Superclass constructor for all RadGrad entities.
   * Defines internal fields needed by all entities: _type, _collectionName, _collection, and _schema.
   * @param {String} type The name of the entity defined by the subclass.
   * @param {SimpleSchema} schema The schema for validating fields on insertion to the DB.
   * @param {SimpleSchema} defineSchema the schema for validating the define parameters.
   */
  constructor(type, schema, defineSchema) {
    this._type = type;
    this._collectionName = `${type}Collection`;
    this._collection = new Mongo.Collection(`${type}Collection`);
    this._schema = schema;
    this._collection.attachSchema(this._schema);
    this._defineSchema = defineSchema;
  }

  /**
   * Returns the number of documents in this collection.
   * @returns { Number } The number of elements in this collection.
   */
  count() {
    return this._collection.find().count();
  }

  /**
   * Returns the schema for defining documents in this collection.
   * @returns {SimpleSchema|*}
   */
  getDefineSchema() {
    return this._defineSchema;
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
            this._collection.findOne(name)) ||
            this._collection.findOne({ name }) ||
            this._collection.findOne({ _id: name });
    if (!doc) {
      throw new Meteor.Error(`${name} is not a defined ${this._type}`);
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
   * Returns true if the passed entity is in this collection.
   * @param { String | Object } name The docID, or an object specifying a documennt.
   * @returns {boolean} True if name exists in this collection.
   */
  isDefined(name) {
    return (
    !!this._collection.findOne(name) ||
    !!this._collection.findOne({ name }) ||
    !!this._collection.findOne({ _id: name }));
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
  }

  /**
   * Removes all elements of this collection.
   * Available for testing purposes only.
   */
  removeAll() {
    this._collection.remove({});
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
   * Returns a string representing all of the documents in this collection.
   * @returns {String}
   */
  toString() {
    return this._collection.find().fetch();
  }

  /**
   * Verifies that the passed object is one of this collection's instances.
   * @param { String | List } name Should be a defined ID or doc in this collection.
   * @throws { Meteor.Error } If not defined.
   */
  assertDefined(name) {
    if (!this.isDefined(name)) {
      throw new Meteor.Error(`${name} is not a valid instance of ${this._type}.`);
    }
  }

  /**
   * Verifies that the list of passed instances are all members of this collection.
   * @param names Should be a list of docs and/or docIDs.
   * @throws { Meteor.Error } If instances is not an array, or if any instance is not in this collection.
   */
  assertAllDefined(names) {
    if (!_.isArray(names)) {
      throw new Meteor.Error(`${names} is not an array.`);
    }
    names.map(name => this.assertDefined(name));
  }

  update(selector, modifier) {
    console.log('BaseCollection.update', selector, modifier);
    this._collection.update(selector, { $set: modifier });
  }
}

/**
 * The BaseCollection used by all RadGrad entities.
 */
export default BaseCollection;
