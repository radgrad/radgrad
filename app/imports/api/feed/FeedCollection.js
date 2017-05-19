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

  // TODO: The define method needs more documentation. What are valid values for each parameter?
  // Consider multiple define methods, one for each feed type, with appropriate required params for each.
  /**
   * Defines a new Feed.
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               feedType: 'new-user'
   *               timestamp: '12345465465', });
   *
   * There are currently six feedTypes: new-user, new-course,
   * new-opportunity, verified-opportunity, new-course-review, and new-opportunity-review.
   * All feeds require keys feedType and timestamp.
   * FeedType new-user requires keys user, feedType, timestamp.
   * FeedType new-course requires keys user, course, feedType, timestamp.
   * FeedType new-opportunity requires keys user, opportunity, feedType, timestamp.
   * FeedType verified-opportunity requires keys user, opportunity, semester, feedType, and timestamp.
   * FeedType new-course-review requires keys user, course, feedType, and timestamp.
   * FeedType new-opportunity-review requires keys user, opportunity, feedType, and timestamp.
   * @param { Object } description Object with keys user, opportunity, course, semester, feedType, and timestamp.
   * @returns The newly created docID.
   */
  defineNewUser({ user, timestamp }) {
    let userIDs;
    let picture;
    let description;
    if (user !== undefined) {
      userIDs = _.map(user, function (u) {
        return Users.getUserFromUsername(u)._id;
      });
      if (userIDs.length > 1) {
        // description = `${Users.getFullName(userIDs[0])} and ${userIDs.length - 1} other(s) have joined RadGrad.`;
        description = {
          user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
          description: 'have joined RadGrad.',
        };
      } else {
        // description = `${Users.getFullName(userIDs[0])} has joined RadGrad.`;
        description = { user: Users.getFullName(userIDs[0]), description: 'has joined RadGrad.' };
      }
      picture = Users.findDoc(userIDs[0]).picture;
      if (!picture) {
        picture = '/images/people/default-profile-picture.png';
      }
    } else {
      throw new Meteor.Error('User must be specified for feedType new-user.');
    }
    const feedID = this._collection.insert({
      userIDs, description, timestamp, picture,
    });
    return feedID;
  }

  /**
   * Defines a new Feed.
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               feedType: 'new-user'
   *               timestamp: '12345465465', });
   *
   * Feed.define({ user: 'abigailkealoha',
   *               course: 'ics-100'
   *               feedType: 'new-course'
   *               timestamp: '12345465465', });
   *
   * Feed.define({ user: 'abigailkealoha',
   *               opportunity: 'att-hackathon'
   *               feedType: 'new-opportunity'
   *               timestamp: '12345465465', });
   *
   * Feed.define({ user: ['abigailkealoha'],
   *               opportunity: 'att-hackathon'
   *               semester: 'Spring-2013'
   *               feedType: 'verified-opportunity'
   *               timestamp: '12345465465', });
   *
   * Feed.define({ user: ['abigailkealoha'],
   *               course: 'ics111'
   *               feedType: 'new-course-review'
   *               timestamp: '12345465465', });
   *
   * Feed.define({ user: ['abigailkealoha'],
   *               opportunity: 'att-hackathon'
   *               feedType: 'new-opportunity-review'
   *               timestamp: '12345465465', });
   *
   * There are currently six feedTypes: new-user, new-course,
   * new-opportunity, verified-opportunity, new-course-review, and new-opportunity-review.
   * All feeds require keys feedType and timestamp.
   * FeedType new-user requires keys user, feedType, timestamp.
   * FeedType new-course requires keys user, course, feedType, timestamp.
   * FeedType new-opportunity requires keys user, opportunity, feedType, timestamp.
   * FeedType verified-opportunity requires keys user, opportunity, semester, feedType, and timestamp.
   * FeedType new-course-review requires keys user, course, feedType, and timestamp.
   * FeedType new-opportunity-review requires keys user, opportunity, feedType, and timestamp.
   * @param { Object } description Object with keys user, opportunity, course, semester, feedType, and timestamp.
   * @returns The newly created docID.
   */
  define({ user, opportunity, course, semester, feedType, timestamp }) {
    let userIDs;
    let opportunityID;
    let courseID;
    let semesterID;
    let picture;
    let description;
    // TODO: The following logic is crazy hard to follow. What are allowable combinations of values?
    if (feedType === 'new-user') {
      if (user !== undefined) {
        userIDs = _.map(user, function (u) {
          return Users.getUserFromUsername(u)._id;
        });
        if (userIDs.length > 1) {
          // description = `${Users.getFullName(userIDs[0])} and ${userIDs.length - 1} other(s) have joined RadGrad.`;
          description = { user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
            description: 'have joined RadGrad.' };
        } else {
          // description = `${Users.getFullName(userIDs[0])} has joined RadGrad.`;
          description = { user: Users.getFullName(userIDs[0]), description: 'has joined RadGrad.' };
        }
        picture = Users.findDoc(userIDs[0]).picture;
        if (!picture) {
          picture = '/images/people/default-profile-picture.png';
        }
      } else {
        throw new Meteor.Error('User must be specified for feedType new-user.');
      }
    } else if (feedType === 'new-opportunity') {
      if (opportunity !== undefined) {
        opportunityID = Opportunities.getID(opportunity);
        // description = `${Opportunities.findDoc(opportunityID).name} has been added to Opportunities.`;
        description = { item: Opportunities.findDoc(opportunityID).name,
          description: 'has been added to Opportunities' };
        picture = '/images/radgrad_logo.png';
      } else {
        throw new Meteor.Error('Opportunity must be specified for feedType new-opportunity.');
      }
    } else if (feedType === 'new-course') {
      if (course !== undefined) {
        courseID = Courses.getID(course);
        // description = `${Courses.findDoc(courseID).name} has been added to Courses.`;
        description = { item: Courses.findDoc(courseID).name,
          description: 'has been added to Courses' };
        picture = '/images/radgrad_logo.png';
      } else {
        throw new Meteor.Error('Course must be specified for feedType new-course.');
      }
    } else if (feedType === 'verified-opportunity') {
      if (user !== undefined) {
        userIDs = _.map(user, function (u) {
          return Users.getUserFromUsername(u)._id;
        });
      } else {
        throw new Meteor.Error('User must be specified for feedType verified-opportunity.');
      }
      if (semester !== undefined) {
        semesterID = Semesters.getID(semester);
      } else {
        throw new Meteor.Error('Semester must be specified for feedType verified-opportunity.');
      }
      if (opportunity !== undefined) {
        opportunityID = Opportunities.getID(opportunity);
        if (userIDs.length > 1) {
          // description = `${Users.getFullName(userIDs[0])} and ${userIDs.length - 1} other(s) have been verified for
          // ${Opportunities.findDoc(opportunityID).name} (${Semesters.toString(semesterID, false)}).`;
          description = { user: Users.getFullName(userIDs[0]), numUsers: userIDs.length - 1,
            description: 'have been verified for', item: Opportunities.findDoc(opportunityID).name,
            semester: Semesters.toString(semesterID, false) };
        } else {
          // description = `${Users.getFullName(userIDs[0])} has been verified for
          // ${Opportunities.findDoc(opportunityID).name} (${Semesters.toString(semesterID, false)}).`;
          description = { user: Users.getFullName(userIDs[0]),
            description: 'has been verified for', item: Opportunities.findDoc(opportunityID).name,
            semester: Semesters.toString(semesterID, false) };
        }
        picture = '/images/radgrad_logo.png';
      } else {
        throw new Meteor.Error('Opportunity must be specified for feedType verified-opportunity.');
      }
    } else if (feedType === 'new-course-review') {
      if (user !== undefined) {
        userIDs = _.map(user, function (u) {
          return Users.getUserFromUsername(u)._id;
        });
      } else {
        throw new Meteor.Error('User must be specified for feedType new-course-review.');
      }
      if (course !== undefined) {
        courseID = Courses.getID(course);
      } else {
        throw new Meteor.Error('Course must be specified for feedType new-course-review.');
      }
      // description = `${Users.getFullName(userIDs[0])} has added a course review for
      // ${Courses.findDoc(courseID).name}.`;
      description = { user: Users.getFullName(userIDs[0]), description: 'has added a course review for ',
        item: Courses.findDoc(courseID).name };
      picture = Users.findDoc(userIDs[0]).picture;
      if (!picture) {
        picture = '/images/people/default-profile-picture.png';
      }
    } else if (feedType === 'new-opportunity-review') {
      if (user !== undefined) {
        userIDs = _.map(user, function (u) {
          return Users.getUserFromUsername(u)._id;
        });
      } else {
        throw new Meteor.Error('User must be specified for feedType new-opportunity-review.');
      }
      if (opportunity !== undefined) {
        opportunityID = Opportunities.getID(opportunity);
      } else {
        throw new Meteor.Error('Opportunity must be specified for feedType new-opportunity-review.');
      }
      // description = `${Users.getFullName(userIDs[0])} has added an opportunity review for
      // ${Opportunities.findDoc(opportunityID).name}.`;
      description = { user: Users.getFullName(userIDs[0]), description: 'has added an opportunity review for ',
        item: Opportunities.findDoc(opportunityID).name };
      picture = Users.findDoc(userIDs[0]).picture;
      if (!picture) {
        picture = '/images/people/default-profile-picture.png';
      }
    } else {
      throw new Meteor.Error(`FeedType ${feedType} is not a valid feedType.`);
    }
    const feedID = this._collection.insert({
      userIDs, opportunityID, courseID, semesterID, description, timestamp, picture, feedType,
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
