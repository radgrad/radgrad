// import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { buildSimpleName } from './PlanChoiceUtilities';

/** @module api/degree-plan/PlanChoiceCollection */

/**
 * Represents a choice in an academic plan.
 * @extends api/base/BaseCollection~BaseCollection
 */
class PlanChoiceCollection extends BaseCollection {

  /**
   * Creates a plan choice.
   */
  constructor() {
    super('PlanChoice', new SimpleSchema({
      choice: { type: String },
    }));
  }

  /**
   * Defines a PlanChoice.
   * @example
   * PlanChoices.define('ics312,ics331-1');
   * Defines the choice of ICS 312 or ICS 331.
   * @param choice
   * @returns {*}
   */
  define(choice) {
    const doc = this._collection.findOne(choice);
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ choice });
  }

  /**
   * Creates a human readable string representation of the choice.
   * @param planChoiceSlug
   * @returns {string}
   */
  toStringFromSlug(planChoiceSlug) { // eslint-disable-line class-methods-use-this
    let ret = '';
    let slug;
    const countIndex = planChoiceSlug.indexOf('-');
    if (countIndex === -1) {
      slug = planChoiceSlug;
    } else {
      slug = planChoiceSlug.substring(0, countIndex);
    }
    while (slug.length > 0) {
      let temp;
      let index;
      if (slug.startsWith('(')) {
        index = slug.indexOf(')');
        temp = slug.substring(1, index);
        ret = `${ret}(${buildSimpleName(temp)}) or `;
        if (index < slug.length - 2) {
          slug = slug.substring(index + 2); // skip over the ,
        } else {
          slug = '';
        }
      } else
        if (slug.indexOf(',') !== -1) {
          index = slug.indexOf(',');
          temp = slug.substring(0, index);
          slug = slug.substring(index + 1);
          ret = `${ret}${buildSimpleName(temp)} or `;
        } else {
          temp = slug;
          slug = '';
          ret = `${ret}${buildSimpleName(temp)} or `;
        }
    }
    return ret.substring(0, ret.length - 4);
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    return problems;
  }

  /**
   * Returns an object representing the PlanChoice docID in a format acceptable to define().
   * @param docID The docID of a PlanChoice.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    return doc.choice;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const PlanChoices = new PlanChoiceCollection();
radgradCollections.push(PlanChoices);
