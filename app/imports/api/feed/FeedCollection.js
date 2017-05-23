import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '/imports/api/course/CourseCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '../base/RadGradCollections';

/** @module api/feed/FeedCollection */

function dateDiffInDays(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a - b) / MS_PER_DAY);
}

function withinPastDay(feed, timestamp) {
  let ret = false;
  const feedTime = feed.timestamp;
  const currentFeedTime = timestamp;
  const timeDiff = dateDiffInDays(currentFeedTime, feedTime);
  if (timeDiff === 0) {
    ret = true;
  }
  return ret;
}

/**
 * Represents a feed instance.
 * @extends module:api/base/BaseInstanceCollection~BaseInstanceCollection
 */
class FeedCollection extends BaseCollection {
  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      userIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      semesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      description: { type: Object, blackbox: true },
      timestamp: { type: Number },   // TODO: shouldn't timestamp be a date object?
      picture: { type: String },
      feedType: { type: String },
    }));
  }

  /**
   * Defines a new Feed (new user).
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               feedType: 'new-user'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys user and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid user.
   */
  defineNewUser({ user, feedType, timestamp }) {
    let userIDs;
    let picture;
    let description;
    let userID;
    userIDs = _.map(user, function (u) {
      userID = Users.getUserFromUsername(u)._id;
      if (!userID) {
        throw new Meteor.Error('User is invalid.');
      }
      return userID;
    });
    if (userIDs.length > 1) {
      description = {
        user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
        description: 'have joined RadGrad.',
      };
    } else {
      description = { user: Users.getFullName(userIDs[0]), description: 'has joined RadGrad.' };
    }
    picture = Users.findDoc(userIDs[0]).picture;
    const feedID = this._collection.insert({ userIDs, description, feedType, timestamp, picture, });
    return feedID;
  }

  /**
   * Defines a new Feed (new course).
   * @example
   * Feed.define({ user: 'abigailkealoha',
   *               course: 'ics-100'
   *               feedType: 'new-course'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys course, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course.
   */
  defineNewCourse({ course, feedType, timestamp }) {
    let courseID;
    let picture;
    let description;
    courseID = Courses.getID(course);
    description = {
      item: Courses.findDoc(courseID).name,
      description: 'has been added to Courses'
    };
    picture = '/images/radgrad_logo.png';
    const feedID = this._collection.insert({ courseID, description, feedType, picture, timestamp, });
    return feedID;
  }

  /**
   * Defines a new Feed (new opportunity).
   * @example
   * Feed.define({ user: 'abigailkealoha',
   *               opportunity: 'att-hackathon'
   *               feedType: 'new-opportunity'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys opportunity, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity.
   */
  defineNewOpportunity({ opportunity, feedType, timestamp }) {
    let opportunityID;
    let picture;
    let description;
    opportunityID = Opportunities.getID(opportunity);
    description = {
      item: Opportunities.findDoc(opportunityID).name,
      description: 'has been added to Opportunities'
    };
    picture = '/images/radgrad_logo.png';
    const feedID = this._collection.insert({ opportunityID, description, timestamp, picture, feedType, });
    return feedID;
  }

  /**
   * Defines a new Feed (verified opportunity).
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               opportunity: 'att-hackathon'
   *               semester: 'Spring-2013'
   *               feedType: 'verified-opportunity'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, semester, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity, semester, or user.
   */
  defineNewVerifiedOpportunity({ user, opportunity, semester, feedType, timestamp }) {
    let userIDs;
    let opportunityID;
    let semesterID;
    let picture;
    let description;
    userIDs = _.map(user, function (u) {
      return Users.getUserFromUsername(u)._id;
    });
    semesterID = Semesters.getID(semester);
    opportunityID = Opportunities.getID(opportunity);
    if (userIDs.length > 1) {
      description = {
        user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
        description: 'have been verified for', item: Opportunities.findDoc(opportunityID).name,
        semester: Semesters.toString(semesterID, false)
      };
    } else {
      description = {
        user: Users.getFullName(userIDs[0]),
        description: 'has been verified for', item: Opportunities.findDoc(opportunityID).name,
        semester: Semesters.toString(semesterID, false)
      };
    }
    picture = '/images/radgrad_logo.png';
    const feedID = this._collection.insert({
      userIDs, opportunityID, semesterID, description, timestamp, picture, feedType,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new course review).
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               course: 'ics111'
   *               feedType: 'new-course-review'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys user, course, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course or user.
   */
  defineNewCourseReview({ user, course, feedType, timestamp }) {
    let userIDs;
    let courseID;
    let picture;
    let description;
    userIDs = _.map(user, function (u) {
      return Users.getUserFromUsername(u)._id;
    });
    courseID = Courses.getID(course);
    description = {
      user: Users.getFullName(userIDs[0]), description: 'has added a course review for ',
      item: Courses.findDoc(courseID).name
    };
    picture = Users.findDoc(userIDs[0]).picture;
    if (!picture) {
      picture = '/images/people/default-profile-picture.png';
    }
    const feedID = this._collection.insert({
      userIDs, courseID, description, timestamp, picture, feedType,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new opportunity review).
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               opportunity: 'att-hackathon'
   *               feedType: 'new-opportunity-review'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity or user.
   */
  defineNewOpportunityReview({ user, opportunity, feedType, timestamp }) {
    let userIDs;
    let opportunityID;
    let picture;
    let description;
    userIDs = _.map(user, function (u) {
      return Users.getUserFromUsername(u)._id;
    });
    opportunityID = Opportunities.getID(opportunity);
    description = {
      user: Users.getFullName(userIDs[0]), description: 'has added an opportunity review for ',
      item: Opportunities.findDoc(opportunityID).name
    };
    picture = Users.findDoc(userIDs[0]).picture;
    if (!picture) {
      picture = '/images/people/default-profile-picture.png';
    }
    const feedID = this._collection.insert({
      userIDs, opportunityID, description, timestamp, picture, feedType,
    });
    return feedID;
  }

  /**
   * Returns a feedID with the same feedType (and opportunity, if feedType is 'verified-opportunity')
   * if it exists within the past 24 hours.
   * Returns false if no such feedID is found.
   * Opportunity is required only if feedType is 'verified-opportunity'
   * @returns {Object} The feedID if found.
   * @returns {boolean} False if feedID is not found.
   */
  checkPastDayFeed(timestamp, feedType, opportunity) {
    let ret = false;
    const existingFeed = _.find(this._collection.find().fetch(), function (feed) {
      if (withinPastDay(feed, timestamp)) {
        if (feed.feedType === feedType) {
          if (feedType === 'verified-opportunity') {
            if (opportunity === feed.opportunityID) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    });
    if (existingFeed) {
      ret = existingFeed._id;
    }
    return ret;
  }

  /**
   * Updates the existingFeedID with the new userID information
   * @param userID the new userID, existingFeedID the existing feed of the same type within the past 24 hours
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  updateNewUser(username, existingFeedID) {
    const user = Users.getUserFromUsername(username);
    const userID = user._id;
    Users.assertDefined(userID);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    const userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    const description = { user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
      description: 'have joined RadGrad.' };
    let picture = Users.findDoc(userID).picture;
    if (!picture) {
      picture = '/images/people/default-profile-picture.png';
    }
    this._collection.update(existingFeedID, { $set: { userIDs, description, picture } });
  }

  /**
   * Updates the existingFeedID with the new userID information
   * @param userID the new userID, existingFeedID the existing feed of the same type within the past 24 hours
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  updateVerifiedOpportunity(username, existingFeedID) {
    const user = Users.getUserFromUsername(username);
    const userID = user._id;
    Users.assertDefined(userID);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    const userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    const description = { user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
      description: 'have been verified for', item: Opportunities.findDoc(existingFeed.opportunityID).name,
      semester: Semesters.toString(existingFeed.semesterID, false) };
    this._collection.update(existingFeedID, { $set: { userIDs, description } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, userID, opportunityID, and courseID.
   * Note that userID, opportunityID, and courseID are all optional.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      _.forEach(doc.userIDs, userID => {
        if (!Users.isDefined(userID)) {
          problems.push(`Bad userID: ${userID}`);
        }
      });
      if (!Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
      if (!Courses.isDefined(doc.courseID)) {
        problems.push(`Bad courseID: ${doc.courseID}`);
      }
      if (doc.semesterID && !Semesters.isDefined(doc.semesterID)) {
        problems.push(`Bad semesterID: ${doc.semesterID}`);
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
    let user;
    if (doc.userIDs) {
      user = _.map(doc.userIDs, userID => Users.findSlugByID(userID));
    }
    let opportunity;
    if (doc.opportunityID) {
      opportunity = Opportunities.findSlugByID(doc.opportunityID);
    }
    let course;
    if (doc.courseID) {
      course = Courses.findSlugByID(doc.courseID);
    }
    let semester;
    if (doc.semesterID) {
      semester = Semesters.findSlugByID(doc.semesterID);
    }
    const feedType = doc.feedType;
    const timestamp = doc.timestamp;
    return { user, opportunity, course, semester, feedType, timestamp };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feeds = new FeedCollection();
radgradCollections.push(Feeds);
