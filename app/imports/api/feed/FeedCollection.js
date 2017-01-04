import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '/imports/api/user/UserCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Courses } from '/imports/api/course/CourseCollection';


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
   * Teaser.define({ student: 'abigailkealoha',
   *                    description: 'has leveled up to Level 1!',
   *                    timestamp: '12345465465',
   * @param { Object } description Object with keys student, description, and timestamp.
   * Slug must be previously undefined.
   * Interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestID.
   * @returns The newly created docID.
   */
  define({ student, opportunity, course, feedType, timestamp }) {
    let studentID;
    let opportunityID;
    let courseID;
    let picture;
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
        picture = Users.findDoc(studentID).picture;
      } else if (opportunity !== undefined) {
        description = `${Opportunities.findDoc(opportunityID).name} has been added to Opportunities.`;
        picture = '/images/radgrad_logo.png';
      } else if (course !== undefined) {
        description = `${Courses.findDoc(courseID).name} has been added to Courses.`;
        picture = '/images/radgrad_logo.png';
      }
    } else if (feedType === 'verified') {
      description = `${Users.getFullName(studentID)} has been verified for 
        ${Opportunities.findDoc(opportunityID).name}.`;
      picture = Users.findDoc(studentID).picture;
    }
    const feedID = this._collection.insert({ studentID, opportunityID, courseID, description, timestamp, picture });
    return feedID;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feed = new FeedCollection();

