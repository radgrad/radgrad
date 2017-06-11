import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Courses } from '/imports/api/course/CourseCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';

/** @module api/feed/FeedCollection */

function dateDiffInDays(a, b) {
  const ams = Date.parse(a);
  const bms = Date.parse(b);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((ams - bms) / MS_PER_DAY);
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
 * @extends module:api/base/BaseSlugCollection~BaseSlugCollection
 */
class FeedCollection extends BaseCollection {
  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      userIDs: { type: Array },
      'userIDs.$': SimpleSchema.RegEx.Id,
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      semesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      description: String,
      timestamp: Date,
      picture: String,
      feedType: String,
    }));
  }

  /**
   * Defines a new Feed (new user).
   * @example
   * Feed.define({ user: ['abigailkealoha'],
   *               feedType: 'new-user'
   *               timestamp: '12345465465' });
   * @param { Object } description Object with keys user and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid user.
   */
  defineNewUser({ user, feedType, timestamp = moment().toDate() }) {
    let description;
    const userIDs = Users.getIDs(user);
    if (userIDs.length > 1) {
      description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) 
        and {{> Student_Feed_Modal ${userIDs.length - 1}}} others have joined RadGrad.`;
    } else {
      description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) 
      has joined RadGrad.`;
    }
    const picture = Users.findDoc(userIDs[0]).picture;
    const feedID = this._collection.insert({ userIDs, description, feedType, timestamp, picture });
    return feedID;
  }

  /**
   * Defines a new Feed (new course).
   * @example
   * Feed.define({ course: 'ics-100'
   *               feedType: 'new-course'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys course, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course.
   */
  defineNewCourse({ course, feedType, timestamp = moment().toDate() }) {
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `[${c.name}](./explorer/courses/${Slugs.getNameFromID(c.slugID)}) 
      has been added to Courses`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this._collection.insert({ userIDs: [], courseID, description, feedType, picture, timestamp });
    return feedID;
  }

  /**
   * Defines a new Feed (new opportunity).
   * @example
   * Feed.define({ opportunity: 'att-hackathon'
   *               feedType: 'new-opportunity'
   *               timestamp: '12345465465', });
   * @param { Object } description Object with keys opportunity, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity.
   */
  defineNewOpportunity({ opportunity, feedType, timestamp = moment().toDate() }) {
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `[${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) 
      has been added to Opportunities`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this._collection.insert({ userIDs: [], opportunityID, description, timestamp, picture, feedType });
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
  defineNewVerifiedOpportunity({ user, opportunity, semester, feedType, timestamp = moment().toDate() }) {
    let description;
    const userIDs = Users.getIDs(user);
    const semesterID = Semesters.getID(semester);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    if (userIDs.length > 1) {
      description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) 
        and ${userIDs.length - 1} others have been verified for 
        [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) 
        (${Semesters.toString(semesterID, false)})`;
    } else {
      description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])})
        has been verified for [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)})
        (${Semesters.toString(semesterID, false)})`;
    }
    const picture = '/images/radgrad_logo.png';
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
  defineNewCourseReview({ user, course, feedType, timestamp = moment().toDate() }) {
    let picture;
    const userIDs = Users.getIDs(user);
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) 
      has added a course review for [${c.name}](./explorer/courses/${Slugs.getNameFromID(c.slugID)})`;
    picture = Users.findDoc(userIDs[0]).picture;
    if (!picture) {
      picture = '/images/people/default-profile-picture.png';
    }
    const feedID = this._collection.insert({ userIDs, courseID, description, timestamp, picture, feedType });
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
  defineNewOpportunityReview({ user, opportunity, feedType, timestamp = moment().toDate() }) {
    let picture;
    const userIDs = Users.getIDs(user);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])})  
      has added an opportunity review for 
      [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)})`;
    picture = Users.findDoc(userIDs[0]).picture;
    if (!picture) {
      picture = '/images/people/default-profile-picture.png';
    }
    const feedID = this._collection.insert({ userIDs, opportunityID, description, timestamp, picture, feedType });
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
  checkPastDayFeed(feedType, opportunity, timestamp = moment().toDate()) {
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
    const description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) 
      and {{> Student_Feed_Modal ${userIDs.length - 1}}} others have joined RadGrad.`;
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
    const o = Opportunities.findDoc(existingFeed.opportunityID);
    const description = `[${Users.getFullName(userIDs[0])}](./explorer/users/${Users.getSlugName(userIDs[0])}) and 
      ${userIDs.length - 1} others have been verified for 
      [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) 
      (${Semesters.toString(existingFeed.semesterID, false)})`;
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

  /**
   * Defines the entity represented by dumpObject.
   * Defaults to calling the define() method if it exists.
   * @param dumpObject An object representing one document in this collection.
   * @returns { String } The docID of the newly created document.
   */
  restoreOne(dumpObject) {
    if (dumpObject.feedType === 'new-user') {
      this.defineNewUser(dumpObject);
    } else if (dumpObject.feedType === 'new-course') {
      this.defineNewCourse(dumpObject);
    } else if (dumpObject.feedType === 'new-opportunity') {
      this.defineNewOpportunity(dumpObject);
    } else if (dumpObject.feedType === 'new-verified-opportunity') {
      this.defineNewVerifiedOpportunity(dumpObject);
    } else if (dumpObject.feedType === 'new-course-review') {
      this.defineNewCourseReview(dumpObject);
    } else if (dumpObject.feedType === 'new-opportunity-review') {
      this.defineNewOpportunityReview(dumpObject);
    }
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feeds = new FeedCollection();
