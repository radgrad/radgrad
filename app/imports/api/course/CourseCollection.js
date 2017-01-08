import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';


/** @module Course */

/**
 * Represents a specific course, such as "ICS 311".
 * To represent a specific course for a specific semester, use CourseInstance.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class CourseCollection extends BaseInstanceCollection {

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
      moreInformation: { type: String, optional: true },
      prerequisites: { type: [String], optional: true }, // stored as a slug for some reason.
    }));
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
   *                  moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS215/',
   *                  prerequisites: ['ics211'] });
   * @param { Object } description Object with keys name, shortName, slug, number, description, creditHrs, interests.
   * Name is the official course name.
   * ShortName is an optional abbreviation. Defaults to name.
   * Slug must not be previously defined.
   * CreditHrs is optional and defaults to 3. If supplied, must be a number between 1 and 15.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * Syllabus is optional. If supplied, should be a URL.
   * MoreInformation is optional. If supplied, should be a URL.
   * Prerequisites is optional. If supplied, must be an array of previously defined Course slugs or courseIDs.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest or invalid creditHrs.
   * @returns The newly created docID.
   */
  define({
      name, shortName = name, slug, number, description, creditHrs = 3,
      interests, syllabus, moreInformation, prerequisites = [],
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
    _.each(prerequisites, (prerequisite) => this.getID(prerequisite));
    const courseID =
        this._collection.insert({
          name, shortName, slugID, number, description, creditHrs, interestIDs, syllabus,
          moreInformation, prerequisites,
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
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Courses = new CourseCollection();
radgradCollections.push(Courses);


