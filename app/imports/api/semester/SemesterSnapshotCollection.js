import { moment } from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class SemesterSnapshotCollection extends BaseCollection {

  /**
   * Creates the SemesterSnapshot collection
   */
  constructor() {
    super('SemesterSnapshot', new SimpleSchema({
      semesterID: { type: String },
      timestamp: { type: Date },
      yearOne: [String],
      yearTwo: [String],
      yearThree: [String],
      yearFour: [String],
      yearFive: [String],
      radGradActive: [String],
      radGradInactive: [String],
      copActive: [String],
      copInactive: [String],
    }));
  }
  define({ semesterID, timestamp = moment().toDate(), year1, year2, year3, year4, year5, radGradActive,
           radGradInactive, copActive, copInactive }) {
    return this._collection.insert({ semesterID, timestamp, year1, year2, year3, year4, year5,
      radGradActive, radGradInactive, copActive, copInactive });
  }
  /**
   * Remove the SemesterSnapshot instance.
   * @param docID The docID of the SemesterSnapshot.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    super.removeIt(docID);
  }
  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    return problems;
  }
  /**
   * Returns an object representing the SemesterSnapshot docID in a format acceptable to define().
   * @param docID The docID of a SemesterSnapshot.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const semesterID = doc.semesterID;
    const timestamp = doc.timestamp;
    const yearOne = doc.yearOne;
    const yearTwo = doc.yearTwo;
    const yearThree = doc.yearThree;
    const yearFour = doc.yearFour;
    const yearFive = doc.yearFive;
    const radGradActive = doc.radGradActive;
    const radGradInactive = doc.radGradInactive;
    const copActive = doc.copActive;
    const copInactive = doc.copInactive;
    return { semesterID, timestamp, yearOne, yearTwo, yearThree, yearFour, yearFive,
      radGradActive, radGradInactive, copActive, copInactive };
  }
}

export const SemesterSnapshots = new SemesterSnapshotCollection();
