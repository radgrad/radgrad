import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { moment } from 'meteor/momentjs:moment';
import { Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';

/**
 * Represents a specific semester, such as "Spring, 2016", "Fall, 2017", or "Summer, 2015".
 * @extends api/base.BaseSlugCollection
 * @memberOf api/semester
 */
class SemesterCollection extends BaseSlugCollection {
  /**
   * Creates the Semester collection.
   */
  constructor() {
    super('Semester', new SimpleSchema({
      term: { type: String },
      year: { type: Number },
      semesterNumber: { type: Number },
      slugID: { type: SimpleSchema.RegEx.Id },
      retired: { type: Boolean, optional: true },
    }));
    this.SPRING = 'Spring';
    this.SUMMER = 'Summer';
    this.FALL = 'Fall';
    this.WINTER = 'Winter';
    this.terms = [this.SPRING, this.SUMMER, this.FALL];
    this.fallStart = parseInt(moment('08-15-2015', 'MM-DD-YYYY')
      .format('DDD'), 10);
    this.springStart = parseInt(moment('01-01-2015', 'MM-DD-YYYY')
      .format('DDD'), 10);
    this.summerStart = parseInt(moment('05-15-2015', 'MM-DD-YYYY')
      .format('DDD'), 10);
  }

  /**
   * Returns an object representing the Semester docID in a format acceptable to define().
   * @param docID The docID of a Semester.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const { term } = doc;
    const { year } = doc;
    const { retired } = doc;
    return { term, year, retired };
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
  define({ term, year, retired }) {
    // console.log('Semesters.define(term=%o, year=%o, retired=%o)', term, year, retired);
    // Check that term and year are valid.
    if (this.terms.indexOf(term) < 0) {
      throw new Meteor.Error('Invalid term: ', term, Error().stack);
    }
    if ((year < 1990) || (year > 2050)) {
      throw new Meteor.Error('Invalid year: ', year, Error().stack);
    }

    // Return immediately if semester is already defined.
    const doc = this._collection.findOne({ term, year });
    // console.log(doc);
    if (doc) {
      return doc._id;
    }

    // Otherwise define a new semester and add it to the collection if successful.

    // Compute semesterNumber, another number that puts semesters into chronological order.
    // Epoch is Fall-2010
    let semesterNumber = 0;
    const yearDiff = year - 2010;
    if (term === this.SPRING) {
      semesterNumber = (3 * yearDiff) - 2;
    } else if (term === this.SUMMER) {
      semesterNumber = (3 * yearDiff) - 1;
    } else {
      semesterNumber = 3 * yearDiff;
    }

    // Determine what the slug looks like.
    const slug = `${term}-${year}`;

    if (Slugs.isDefined(slug)) {
      throw new Meteor.Error(`Slug is already defined for undefined semester: ${slug}`, '', Error().stack);
    }
    const slugID = Slugs.define({ name: slug, entityName: 'Semester' });
    const semesterID = this._collection.insert({
      term, year, semesterNumber, slugID, retired,
    });
    Slugs.updateEntityID(slugID, semesterID);
    return semesterID;
  }

  /**
   * Update a Semester's retired flag.
   * @param docID The docID (or slug) associated with this course.
   * @param retired boolean (optional)
   */
  update(instance, { retired }) {
    const docID = this.getID(instance);
    const updateData = {};
    if (retired) {
      updateData.retired = retired;
    } else {
      updateData.retired = false;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Ensures the passed object is a Semester instance.
   * @param semester Should be a defined semesterID or semester doc.
   * @throws {Meteor.Error} If semester is not a Semester.
   */
  assertSemester(semester) {
    if (!this.isDefined(semester)) {
      throw new Meteor.Error(`${semester} is not a valid Semester.`, '', Error().stack);
    }
  }

  /**
   * Returns the semesterID associated with the current semester based upon the current timestamp.
   * See Semesters.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  getCurrentSemesterID() {
    const year = moment()
      .year();
    const day = moment()
      .dayOfYear();
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
   * Returns true if the passed semester occurs now or in the future.
   * @param semester The semester (slug or semesterID).
   * @returns True if semester is in the future.
   */
  isUpcomingSemester(semester) {
    const semesterID = this.getID(semester);
    return this.findDoc(semesterID).semesterNumber >= this.getCurrentSemesterDoc().semesterNumber;
  }

  /**
   * Returns the semester doc associated with the current semester based upon the current timestamp.
   * See Semesters.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  getCurrentSemesterDoc() {
    const id = this.getCurrentSemesterID();
    return this.findDoc(id);
  }

  /**
   * Returns the semester ID corresponding to the given date.
   * @param date The date as a string. Must be able to be parsed by moment();
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
   * Returns the semester docID associated with the passed semester slug or docID.
   * If the semester does not exist, it is defined.
   * @param semester The Slug or docID associated with a semester
   * @returns The semester ID.
   * @throws { Meteor.Error } If the passed semester is not a valid semester slug.
   */
  getID(semester) {
    // console.log('Semesters.getID(%o)', semester);
    // debugger; // eslint-disable-line
    if (this.isDefined(semester)) {
      return super.getID(semester);
    }
    // Otherwise semester should be a slug.  Try to define it.
    const split = semester.split('-');
    const term = split[0];
    const year = parseInt(split[1], 10);
    return this.define({ term, year });
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
   * Returns a four character "shortname" for a semester and year: Fa18, Sp19, Su20
   * @param semesterID The semester
   * @returns {string} The shortname.
   */
  getShortName(semesterID) {
    this.assertSemester(semesterID);
    const semesterDoc = this.findDoc(semesterID);
    const yearString = `${semesterDoc.year}`.substring(2, 4);
    const termString = (semesterDoc.term === 'Fall') ? 'Fall' : semesterDoc.term.substring(0, 3);
    return `${termString} ${yearString}`;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Slugs.isDefined(doc.slugID)) {
          problems.push(`Bad slugID: ${doc.slugID}`);
        }
      });
    return problems;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/semester.SemesterCollection}
 * @memberOf api/semester
 */
export const Semesters = new SemesterCollection();
