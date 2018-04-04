import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Semesters} from './SemesterCollection';

class SemesterSnapshotCollection extends BaseCollection {

  /**
   * Creates the SemesterSnapshot collection
   */
  constructor() {
    super('SemesterSnapshot', new SimpleSchema({
      semesterID: { type: String },
      year1: [String],
      year2: [String],
      year3: [String],
      year4: [String],
      year5: [String],
      radGradActive: [String],
      radGradInactive: [String],
      copActive: [String],
      copInactive: [String],
    }));
  }

  define({ term, year }) {
    const semester = Semesters.findOne({ term: term, year: year });
    console.log(semester);
    const semesterID = Semesters.getID(semester);
    const year1 = ['test'];
    const year2 = ['test'];
    const year3 = ['test'];
    const year4 = ['test'];
    const year5 = ['test'];
    const radGradActive = ['test'];
    const radGradInactive = ['test'];
    const copActive = ['test'];
    const copInactive = ['test'];
    this._collection.insert({ semesterID, year1, year2, year3, year4, year5,
      radGradActive, radGradInactive, copActive, copInactive });
  }
}

export const SemesterSnapshots = new SemesterSnapshotCollection();