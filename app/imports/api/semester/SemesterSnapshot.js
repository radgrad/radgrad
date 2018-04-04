import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Semesters} from './SemesterCollection';

class SemesterSnapshot extends BaseCollection {

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
    const semesterID = Semesters.findOne({ });
  }
}

