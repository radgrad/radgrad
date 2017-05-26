import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';


/** @module api/course/CourseCollection */

/**
 * Represents a specific course, such as "ICS 311".
 * To represent a specific course for a specific semester, use CourseInstance.
 * @extends module:api/base/BaseSlugCollection~BaseSlugCollection
 */
class CourseCollection extends BaseSlugCollection {

  /**
   * Creates the Course collection.
   */
  constructor() {
    super('Course', new SimpleSchema({
      name: { type: String },
      shortName: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      number: { type: String },
      description: { type: String },
      creditHrs: { type: Number },
      interestIDs: { type: [SimpleSchema.RegEx.Id] },
      // Optional data
      syllabus: { type: String, optional: true },
      prerequisites: { type: [String], optional: true }, // stored as a slug for some reason.
    }));
    this.unInterestingSlug = 'other';
  }

  /**
   * Defines a new Course.
   * @example
   * Courses.define({ name: 'Introduction to the theory and practice of scripting',
   *                  shortName: 'Intro to Scripting',
   *                  slug: 'ics215',
   *                  number: 'ICS 215',
   *                  description: 'Introduction to scripting languages for the integration of applications.',
   *                  creditHrs: 4,
   *                  interests: ['perl', 'javascript', 'ruby'],
   *                  syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
   *                  prerequisites: ['ics211'] });
   * @param { Object } description Object with keys name, shortName, slug, number, description, creditHrs,
   *                   interests, syllabus, and prerequisites.
   * Name is the official course name.
   * ShortName is an optional abbreviation. Defaults to name.
   * Slug must not be previously defined.
   * CreditHrs is optional and defaults to 3. If supplied, must be a number between 1 and 15.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * Syllabus is optional. If supplied, should be a URL.
   * Prerequisites is optional. If supplied, must be an array of previously defined Course slugs or courseIDs.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest or invalid creditHrs.
   * @returns The newly created docID.
   */
  define({
      name, shortName = name, slug, number, description, creditHrs = 3,
      interests, syllabus, prerequisites = [],
  }) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Make sure creditHrs is a number between 1 and 15.
    if (!(typeof creditHrs) === 'number' || (creditHrs < 1) || (creditHrs > 15)) {
      throw new Meteor.Error(`CreditHrs ${creditHrs} is not a number between 1 and 15.`);
    }
    if (!Array.isArray(prerequisites)) {
      throw new Meteor.Error(`Prerequisites ${prerequisites} is not an array.`);
    }
    // Ensure each prereq is either a slug or a courseID.
    // Currently we don't dump the DB is a way that prevents forward referencing of prereqs, so we
    // can't enforce this during the define.
    // TODO: check that prerequisite strings are valid after all courses are defined.
    // _.each(prerequisites, (prerequisite) => this.getID(prerequisite));
    const courseID =
        this._collection.insert({
          name, shortName, slugID, number, description, creditHrs, interestIDs, syllabus, prerequisites,
        });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, courseID);
    return courseID;
  }

  getSlug(courseID) {
    this.assertDefined(courseID);
    const courseDoc = this.findDoc(courseID);
    return Slugs.findDoc(courseDoc.slugID).name;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestIDs.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      _.forEach(doc.interestIDs, interestID => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the Course docID in a format acceptable to define().
   * @param docID The docID of a Course.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const shortName = doc.shortName;
    const slug = Slugs.getNameFromID(doc.slugID);
    const number = doc.number;
    const description = doc.description;
    const creditHrs = doc.creditHrs;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const syllabus = doc.syllabus;
    const prerequisites = doc.prerequisites;
    return { name, shortName, slug, number, description, creditHrs, interests, syllabus,
      prerequisites };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Courses = new CourseCollection();
