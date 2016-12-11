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
      sortBy: { type: Number },
      slugID: { type: SimpleSchema.RegEx.Id },
    }), new SimpleSchema({
      term: { type: String },
      year: { type: Number },
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
    let sortBy = 0;
    if (term === this.FALL) {
      sortBy = (year * 10) + 2;
    } else if (term === this.SPRING) {
      sortBy = year * 10;
    } else {
      sortBy = (year * 10) + 1;
    }
    // Otherwise define a new semester and add it to the collection if successful.
    const slug = `${term}-${year}`;
    if (Slugs.isDefined(slug)) {
      throw new Meteor.Error(`Slug is already defined for undefined semester: ${slug}`);
    }
    const slugID = Slugs.define({ name: slug, entityName: 'Semester' });
    const semesterID = this._collection.insert({ term, year, sortBy, slugID });
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
   * Returns the semesterID associated with the current semester based upon the current timestamp.
   * See Semesters.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  getCurrentSemester() {
    const year = moment().year();
    const day = moment().dayOfYear();
    let term = '';
    if (day >= this.fallStart) {
      term = this.FALL;
    } else if (day >= this.summerStart) {
      term = this.SUMMER;
    } else {
      term = this.SPRING;
    }
    return this.define({ term, year });
  }

  /**
   * Returns the semesterID associated with the current semester based upon the current timestamp.
   * See Semesters.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  getCurrentSemesterDoc() {
    const year = moment().year();
    const day = moment().dayOfYear();
    let term = '';
    if (day >= this.fallStart) {
      term = this.FALL;
    } else if (day >= this.summerStart) {
      term = this.SUMMER;
    } else {
      term = this.SPRING;
    }
    const id = this.define({ term, year });
    return this._collection.findOne({ _id: id });
  }

  /**
   * Returns the semester ID corresponding to the given date.
   * @param date The date.
   * @returns {String} The semesterID that the date falls in.
   */
  getSemester(date) {
    const d = moment(date);
    const year = d.year();
    const day = d.dayOfYear();
    let term = '';
    if (day >= this.fallStart) {
      term = this.FALL;
    } else if (day >= this.summerStart) {
      term = this.SUMMER;
    } else {
      term = this.SPRING;
    }
    return this.define({ term, year });
  }

  /**
   * Returns the semester document corresponding to the given date.
   * @param date The date.
   * @returns Object The semester that the date falls in.
   */
  getSemesterDoc(date) {
    const id = this.getSemester(date);
    return this.findDoc(id);
  }

  /**
   * Returns the slug associated with the semesterID.
   * @param semesterID the semester ID.
   */
  getSlug(semesterID) {
    this.assertSemester(semesterID);
    const semesterDoc = this.findDoc(semesterID);
    return Slugs.findDoc(semesterDoc.slugID).name;
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

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Semesters = new SemesterCollection();

