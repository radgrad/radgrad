import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { Slugs } from '../slug/SlugCollection';
import BaseCollection from '../base/BaseCollection';


/**
 * BaseType is an abstract superclass that factors out common code for the "type" entities: OpportunityType and TagType.
 * @memberOf api/base
 * @extends api/base.BaseCollection
 */
class BaseTypeCollection extends BaseCollection {

  /**
   * Creates the BaseType collection.
   */
  constructor(collectionType) {
    super(collectionType, new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
    }));
  }

  /**
   * Defines a new BaseType with its name, slug, and description.
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  define({ name, slug, description }) {
    const slugID = Slugs.define({ name: slug, entityName: this._type });
    const baseTypeID = this._collection.insert({ name, description, slugID });
    Slugs.updateEntityID(slugID, baseTypeID);
    return baseTypeID;
  }

  /**
   * Returns the docID associated with instance, or throws an error if it cannot be found.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * If instance is an object with an _id field, then that value is checked to see if it's in the collection.
   * @param { String } instance Either a valid docID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  getID(instance) {
    let id;
    if (_.isObject(instance) && instance._id) {
      instance = instance._id; // eslint-disable-line no-param-reassign
    }
    try {
      id = (this._collection.findOne({ _id: instance })) ? instance : this.findIdBySlug(instance);
    } catch (err) {
      throw new Meteor.Error(`Error in ${this._collectionName} getID(): Failed to convert ${instance} to an ID.`,
        '', Error().stack);
    }
    return id;
  }

  /**
   * Returns the docIDs associated with instances, or throws an error if any cannot be found.
   * If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.
   * @param { String[] } instances An array of valid docIDs, slugs, or a combination.
   * @returns { String[] } The docIDs associated with instances.
   * @throws { Meteor.Error } If any instance is not a docID or a slug.
   */
  getIDs(instances) {
    let ids;
    try {
      ids = (instances) ? instances.map((instance) => this.getID(instance)) : [];
    } catch (err) {
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${instances} to an ID.`, '', Error().stack);
    }
    return ids;
  }


  /**
   * Removes the passed instance from its collection.
   * Also removes the associated Slug.
   * Note that prior to calling this method, the subclass should do additional checks to see if any dependent
   * objects have been deleted.
   * @param { String } instance A docID or slug representing the instance.
   * @throws { Meteor.Error} If the instance (and its associated slug) cannot be found.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    const doc = super.findDoc(docID);
    check(doc, Object);
    if (Slugs.isDefined(doc.slugID)) {
      const slugDoc = Slugs.findDoc(doc.slugID);
      check(slugDoc, Object);
      Slugs.removeIt(slugDoc);
    }
    super.removeIt(doc);
  }

  /**
   * Return true if instance is a docID or a slug for this entity.
   * @param { String } instance A docID or a slug.
   * @returns {boolean} True if instance is a docID or slug for this entity.
   */
  isDefined(instance) {
    return (super.isDefined(instance) || this.hasSlug(instance));
  }

  /**
   * Returns true if the passed slug is associated with an entity of this type.
   * @param { String } slug Either the name of a slug or a slugID.
   * @returns {boolean} True if the slug is in this collection.
   */
  hasSlug(slug) {
    return (!!(this._collection.findOne({ slug })) || Slugs.isSlugForEntity(slug, this._type));
  }

  /**
   * Returns the document associated with the passed slug.
   * @param { String } slug The slug (string or docID).
   * @returns { Object } The document.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an
   * instance in this collection.
   */
  findDocBySlug(slug) {
    const id = Slugs.getEntityID(slug, this._type);
    return this._collection.findOne(id);
  }

  /**
   * Returns the slug name associated with this docID.
   * @param docID The docID
   * @returns { String } The slug name
   * @throws { Meteor.Error } If docID is not associated with this entity.
   */
  findSlugByID(docID) {
    this.assertDefined(docID);
    return Slugs.findDoc(this.findDoc(docID).slugID).name;
  }

  /**
   * Return the docID of the instance associated with this slug.
   * @param { String } slug The slug (string or docID).
   * @returns { String } The docID.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  findIdBySlug(slug) {
    return Slugs.getEntityID(slug, this._type);
  }

  /**
   * Returns the name associated with this docID.
   * @param docID The docID for this "type".
   * @returns The name of this "type" instance.
   * @throws { Meteor.Error } If the passed docID is not valid.
   */
  getNameFromID(docID) {
    this.assertDefined(docID);
    return this.findDoc(docID).name;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID.
   * This is the default integrity checker for all BaseTypeCollection subclasses.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the "Type" docID in a format acceptable to define().
   * @param docID The docID of a "Type".
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const description = doc.description;
    return { name, slug, description };
  }
}

/**
 * Provide this class for use by OpportunityType and TagType.
 */
export default BaseTypeCollection;
