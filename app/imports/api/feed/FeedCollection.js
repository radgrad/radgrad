import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '/imports/api/user/UserCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';

/** @module Feed */

/**
 * Represents a feed instance.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class FeedCollection extends BaseInstanceCollection {

  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      slugID: { type: SimpleSchema.RegEx.Id },
      studentID: { type: SimpleSchema.RegEx.Id, optional: true },
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      description: { type: String },
      timestamp: { type: Number },   // TODO: shouldn't timestamp be a date object?
      picture: { type: String },
      feedType: { type: String, optional: true },
    }));
  }

  // TODO: The define method needs more documentation. What are valid values for each parameter?
  // Consider multiple define methods, one for each feed type, with appropriate required params for each.

  /**
   * Defines a new Feed.
   * @example
   * Feed.define({ student: 'abigailkealoha',
   *               opportunity: 'att-hackathon
   *               course: undefined
   *               feedType: 'verified'
   *               timestamp: '12345465465',
   * @param { Object } description Object with keys student, opportunity, course, feedType, and timestamp.
   * @returns The newly created docID.
   */
  define({ student, opportunity, course, feedType, timestamp }) {
    let studentID;
    let opportunityID;
    let courseID;
    let picture;
    let slugID;
    // TODO: The following logic is crazy hard to follow. What are allowable combinations of values?
    if (student) {
      studentID = Users.getID(student);
    }
    if (opportunity) {
      opportunityID = Opportunities.getID(opportunity);
    }
    if (course) {
      courseID = Courses.getID(course);
    }
    let description = '';
    if (feedType === 'new') {
      if (student !== undefined) {
        description = `${Users.getFullName(studentID)} has joined RadGrad.`;
        slugID = Slugs.define({ name: `feed-${Users.findDoc(studentID).username}-new`, entityName: this.getType() });
        picture = Users.findDoc(studentID).picture;
        if (!picture) {
          picture = '/images/ICS-logo.png';
        }
      } else
        if (opportunity !== undefined) {
          description = `${Opportunities.findDoc(opportunityID).name} has been added to Opportunities.`;
          slugID = Slugs.define({
            name: `feed-${Slugs.getDoc(Opportunities.findDoc(opportunityID).slugID).name}-new`,
            entityName: this.getType(),
          });
          picture = '/images/radgrad_logo.png';
        } else
          if (course !== undefined) {
            description = `${Courses.findDoc(courseID).name} has been added to Courses.`;
            slugID = Slugs.define({
              name: `${Slugs.getDoc(Courses.findDoc(courseID).slugID).name}-new`,
              entityName: this.getType(),
            });
            picture = '/images/radgrad_logo.png';
          }
    } else
      if (feedType === 'verified') {
        description = `${Users.getFullName(studentID)} has been verified for 
        ${Opportunities.findDoc(opportunityID).name} (${Semesters.toString(opportunity.semesterID, false)}).`;
        const username = Users.findDoc(studentID).username;
        const oppDate = Semesters.toString(opportunity.semesterID, true);
        const oppName = Slugs.findDoc((Opportunities.findDoc(opportunityID).slugID)).name;
        slugID = Slugs.define({ name: `feed-${username}-${oppName}-${oppDate}-new`, entityName: this.getType() });
        picture = Users.findDoc(studentID).picture;
      }
    const feedID = this._collection.insert({
      slugID, studentID, opportunityID, courseID, description, timestamp, picture, feedType,
    });
    Slugs.updateEntityID(slugID, feedID);
    return feedID;
  }

  getSlug(feedID) {
    this.assertDefined(feedID);
    const feedDoc = this.findDoc(feedID);
    return Slugs.findDoc(feedDoc.slugID).name;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, studentID, opportunityID, and courseID.
   * Note that studentID, opportunityID, and courseID are all optional.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (doc.studentID && !Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (doc.opportunityID && !Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
      if (doc.courseID && !Courses.isDefined(doc.courseID)) {
        problems.push(`Bad courseID: ${doc.courseID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Feed docID in a format acceptable to define().
   * @param docID The docID of a Feed.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const student = Users.findSlugByID(doc.studentID);
    const opportunity = doc.opportunityID && Opportunities.findSlugByID(doc.opportunityID);
    const course = doc.courseID && Courses.findSlugByID(doc.courseID);
    const feedType = doc.feedType;
    const timestamp = doc.timestamp;
    return { student, opportunity, course, feedType, timestamp };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feed = new FeedCollection();  // TODO: Rename this to 'Feeds' for consistency with other collections.
radgradCollections.push(Feed);
