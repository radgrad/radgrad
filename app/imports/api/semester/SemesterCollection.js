import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';

/** @module Semester */

/**
 * Represents a specific semester, such as "Spring, 2016", "Fall, 2017", or "Summer, 2015".
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class SemesterCollection extends BaseInstanceCollection {

  /**
   * Creates the Semester collection.
   */
  constructor() {
    super('Semester', new SimpleSchema({
      term: { type: String },
      year: { type: Number },
      slugID: { type: SimpleSchema.RegEx.Id },
    }));
    this.SPRING = 'Spring';
    this.SUMMER = 'Summer';
    this.FALL = 'Fall';
    this.terms = [this.SPRING, this.SUMMER, this.FALL];
    // use Day of Year (1..365) to represent semester boundaries.
    // Boundaries might vary by a day depending upon whether this year is a leap year.
    this.fallStart = parseInt(moment('08-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
    this.springStart = parseInt(moment('01-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
    this.summerStart = parseInt(moment('05-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
  }

  /**
   * Retrieves the docID for the specified Semester, or defines it if not yet present.
   * Implicitly defines the corresponding slug: Spring, 2016 semester is "Spring-2016".
   * @example
   * Semesters.define({ term: Semesters.FALL, year: 2015 });
   * @param { Object } Object with keys term, semester.
   * Term must be one of Semesters.FALL, Semesters.SPRING, or Semesters.SUMMER.
   * Year must be between 1990 and 2050.
   * @throws { Meteor.Error } If the term or year are not correctly specified.
   * @returns The docID for this semester instance.
   */
  define({ term, year }) {
    if (this.terms.indexOf(term) < 0) {
      throw new Meteor.Error('Invalid term: ', term);
    }
    if ((year < 1990) || (year > 2050)) {
      throw new Meteor.Error('Invalid year: ', year);
    }
    // Return immediately if we can find this semester.
    const doc = this._collection.findOne({ term, year });
    if (doc) {
      return doc._id;
    }
    // Otherwise define a new semester and add it to the collection if successful.
    const slug = `${term}-${year}`;
    if (Slugs.isDefined(slug)) {
      throw new Meteor.Error(`Slug is already defined for undefined semester: ${slug}`);
    }
    const slugID = Slugs.define({ name: slug, entityName: 'Semester' });
    const semesterID = this._collection.insert({ term, year, slugID });
    Slugs.updateEntityID(slugID, semesterID);
    return semesterID;
  }

  /**
   * Ensures the passed object is a Semester instance.
   * @param semester Should be a defined semesterID or semester doc.
   * @throws {Meteor.Error} If semester is not a Semester.
   */
  assertSemester(semester) {
    if (!this.isDefined(semester)) {
      throw new Meteor.Error(`${semester} is not a valid Semester.`);
    }
  }

  /**
   * Returns the passed semester, formatted as a string.
   * @param semesterID The semester.
   * @param nospace If true, then term and year are concatenated without a space in between.
   * @returns { String } The semester as a string.
   */
  toString(semesterID, nospace) {
    this.assertSemester(semesterID);
    const semesterDoc = this.findDoc(semesterID);
    return (nospace) ? `${semesterDoc.term}${semesterDoc.year}` : `${semesterDoc.term} ${semesterDoc.year}`;
  }

  /**
   * Returns the semesterID associated with the current semester based upon the current timestamp.
   * See Semesters.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  getThisSemester() {

  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Semesters = new SemesterCollection();

