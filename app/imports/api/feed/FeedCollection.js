import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '/imports/api/user/UserCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';

import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';

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
      timestamp: { type: Number },
      picture: { type: String },
    }));
  }

  /**
   * Defines a new Feed.
   * @example
   * Feed.define({ student: 'abigailkealoha',
   *                 opportunity: 'att-hackathon
   *                 course: undefined
   *                 feedType: 'verified'
   *                 timestamp: '12345465465',
   * @param { Object } description Object with keys student, opportunity, course, feedType, and timestamp.
   * @returns The newly created docID.
   */
  define({ student, opportunity, course, feedType, timestamp }) {
    let studentID;
    let opportunityID;
    let courseID;
    let picture;
    let slugID;
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
      } else if (opportunity !== undefined) {
        description = `${Opportunities.findDoc(opportunityID).name} has been added to Opportunities.`;
        slugID = Slugs.define({ name: `feed-${Slugs.getDoc(Opportunities.findDoc(opportunityID).slugID).name}-new`,
          entityName: this.getType() });
        picture = '/images/radgrad_logo.png';
      } else if (course !== undefined) {
        description = `${Courses.findDoc(courseID).name} has been added to Courses.`;
        slugID = Slugs.define({ name: `${Slugs.getDoc(Courses.findDoc(courseID).slugID).name}-new`,
          entityName: this.getType() });
        picture = '/images/radgrad_logo.png';
      }
    } else if (feedType === 'verified') {
      description = `${Users.getFullName(studentID)} has been verified for 
        ${Opportunities.findDoc(opportunityID).name}.`;
      slugID = Slugs.define({ name: `feed-${Users.findDoc(studentID).username}-
        ${Slugs.getDoc(Opportunities.findDoc(opportunityID).slugID).name}-new`, entityName: this.getType() });
      picture = Users.findDoc(studentID).picture;
    }
    const feedID = this._collection.insert({ slugID, studentID, opportunityID, courseID,
      description, timestamp, picture });
    Slugs.updateEntityID(slugID, feedID);
    return feedID;
  }
  getSlug(feedID) {
    this.assertDefined(feedID);
    const feedDoc = this.findDoc(feedID);
    return Slugs.findDoc(feedDoc.slugID).name;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feed = new FeedCollection();

