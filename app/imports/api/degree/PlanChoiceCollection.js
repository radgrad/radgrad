import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const SimpleChoiceSchema = new SimpleSchema({
  choice: { type: [String] },
});

const ComplexChoiceSchema = new SimpleSchema({
  choices: { type: [SimpleChoiceSchema] },
});

class PlanChoiceCollection extends BaseCollection {

  /**
   * Creates a plan choice.
   */
  constructor() {
    super('PlanChoice', new SimpleSchema({
      planChoice: { type: [ComplexChoiceSchema] },
    }));
  }

  define({ planChoice }) {
    const doc = this._collection.findOne({ planChoice });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ planChoice });
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
    const planChoice = doc.planChoice;
    return { planChoice };
  }

}

export const PlanChoices = new PlanChoiceCollection();
radgradCollections.push(PlanChoices);
