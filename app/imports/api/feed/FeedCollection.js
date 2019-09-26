import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { ROLE } from '../role/Role';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';
import { defaultProfilePicture } from '../user/BaseProfileCollection';

/**
 * Returns the number of whole days between date a and b.
 * @param a The first date.
 * @param b The second date.
 * @returns {number} The number of days between a and b.
 * @memberOf api/feed
 */
function dateDiffInDays(a, b) {
  const ams = Date.parse(a);
  const bms = Date.parse(b);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((ams - bms) / MS_PER_DAY);
}

/**
 * Returns true if the timestamp associated with feed is within a day of timestamp.
 * @param feed The feed.
 * @param timestamp A timestamp.
 * @returns {boolean} True if feed's timestamp is within a day of timestamp.
 * @memberOf api/feed
 */
function withinPastDay(feed, timestamp) {
  const feedTime = feed.timestamp;
  const timeDiff = dateDiffInDays(timestamp, feedTime);
  return (timeDiff === 0);
}

/**
 * Represents a feed instance.
 * @extends api/base.BaseCollection
 * @memberOf api/feed
 */
class FeedCollection extends BaseCollection {
  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      feedType: String,
      description: String,
      timestamp: Date,
      picture: String,
      userIDs: { type: Array }, 'userIDs.$': SimpleSchema.RegEx.Id,
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      semesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      retired: { type: Boolean, optional: true },
    }));
    this.NEW_USER = 'new-user';
    this.NEW_COURSE = 'new-course';
    this.NEW_OPPORTUNITY = 'new-opportunity';
    this.VERIFIED_OPPORTUNITY = 'verified-opportunity';
    this.NEW_COURSE_REVIEW = 'new-course-review';
    this.NEW_OPPORTUNITY_REVIEW = 'new-opportunity-review';
    this.NEW_LEVEL = 'new-level';
  }

  /**
   * Defines a new Feed instance.
   * @param feedDefinition An object representing the new Feed.
   * feedDefinition must have a field named 'feedType' which should be one of the following strings:
   * new-user, new-course, new-opportunity, new-verified-opportunity, new-course-review, or new-opportunity-review.
   * Based upon the feedType, the object should contain additional fields providing the information necessary to
   * define that new feed.
   */
  define(feedDefinition) {
    if (feedDefinition.feedType === this.NEW_USER) {
      return this._defineNewUser(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_COURSE) {
      return this._defineNewCourse(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_OPPORTUNITY) {
      return this._defineNewOpportunity(feedDefinition);
    }
    if (feedDefinition.feedType === this.VERIFIED_OPPORTUNITY) {
      return this._defineNewVerifiedOpportunity(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_COURSE_REVIEW) {
      return this._defineNewCourseReview(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_OPPORTUNITY_REVIEW) {
      return this._defineNewOpportunityReview(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_LEVEL) {
      return this._defineNewLevel(feedDefinition);
    }
    throw new Meteor.Error(`Unknown feed type: ${feedDefinition.feedType}`, '', Error().stack);
  }

  /**
   * Update a Feed instance
   * @param docID The docID to be updated.
   * @param description the new description, optional.
   * @param picture the new picture, optional.
   * @param users the new array of users, optional.
   * @param opportunity the new opportunity slug, optional.
   * @param course the new course slug, optional.
   * @param semester the new semester, optional.
   * @param retired the new retired status, optional.
   * The timestamp and feedtype fields cannot be updated once created.
   * @throws { Meteor.Error } If docID is not defined, or if users, opportunity, or course are not defined.
   */
  update(docID, { description, picture, users, opportunity, course, semester, retired }) {
    this.assertDefined(docID);
    const updateData = {};
    if (description) {
      updateData.description = description;
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (users) {
      updateData.userIDs = _.uniq(Users.getIDs(users));
    }
    if (opportunity) {
      updateData.opportunityID = Opportunities.getID(opportunity);
    }
    if (course) {
      updateData.courseID = Courses.getID(course);
    }
    if (semester) {
      updateData.semesterID = Semesters.getID(semester);
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Adds user to the Feed.  If there is no new-user feed within the past day, then a new Feed is created and its
   * docID is returned.
   * If there is a new-user feed within the past day, then this user is added to that Feed instance and its
   * docID is returned.
   * @example
   * Feeds._defineNewUser({ feedType: Feeds.NEW_USER,
   *                      user: 'abi@hawaii.edu',
   *                      timestamp: '12345465465' });
   * @param { Object } description Object with keys user and timestamp.
   * Note that user can be either a single username string or an array of usernames.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid user.
   */
  _defineNewUser({
    user, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    // First, see if we've already defined any users within the past day.
    const recentFeedID = this.checkPastDayFeed(this.NEW_USER);
    // If there's a recentFeed, then update it instead with this user's info.
    if (recentFeedID) {
      this._updateNewUser(user, recentFeedID);
      return recentFeedID;
    }
    // Otherwise create and return a new feed instance.
    // First, create an array of users if we weren't passed one initially.
    const users = (_.isArray(user)) ? user : [user];
    const userIDs = _.uniq(Users.getIDs(users));
    const description = `A student has joined RadGrad${(userIDs.length > 1) ? ' along with some others.' : '.'}`;
    let picture = Users.getProfile(userIDs[0]).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    return this._collection.insert({ userIDs, description, feedType, timestamp, picture, retired });
  }

  /**
   * Defines a new Feed (new course).
   * @example
   * Feeds._defineNewCourse({ feedType: Feeds.NEW_COURSE,
   *                        course: 'ics-100'
   *                        timestamp: '12345465465', });
   * @param { Object } description Object with keys course, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course.
   */
  _defineNewCourse({
    course, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `[${c.name}](./explorer/courses/${Slugs.getNameFromID(c.slugID)}) 
      has been added to Courses`;
    const picture = '/images/radgrad_logo.png';
    return this._collection.insert({
      userIDs: [],
      courseID,
      description,
      feedType,
      picture,
      timestamp,
      retired,
    });
  }

  /**
   * Defines a new Feed (new opportunity).
   * @example
   * Feeds._defineNewOpportunity({ feedType: Feeds.NEW_OPPORTUNITY,
   *                             opportunity: 'att-hackathon'
   *                             timestamp: '12345465465', });
   * @param { Object } description Object with keys opportunity, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity.
   */
  _defineNewOpportunity({
    opportunity, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `[${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) 
      has been added to Opportunities`;
    const picture = '/images/radgrad_logo.png';
    return this._collection.insert({
      userIDs: [],
      opportunityID,
      description,
      timestamp,
      picture,
      feedType,
      retired,
    });
  }

  /**
   * Adds the verified opportunity to the Feed.
   * If there is no verified-opportunity feed within the past day, then a new Feed instance is created and its docID
   * is returned.
   * If there is a verified-opportunity feed within the past day, then this info is added to it and its docID is
   * returned.
   * @example
   * Feeds._defineNewVerifiedOpportunity({ feedType: Feeds.VERIFIED_OPPORTUNITY,
   *                                      user: 'abi@hawaii.edu',
   *                                      opportunity: 'att-hackathon'
   *                                      semester: 'Spring-2013'
   *                                      timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, semester, feedType, and timestamp.
   * Note that user can be either a single username string or an array of usernames.
   * @returns The docID associated with this info.
   * @throws {Meteor.Error} If not a valid opportunity, semester, or user.
   */
  _defineNewVerifiedOpportunity({
    user, opportunity, semester, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    // First, see if we've already defined any verified-opportunities for this opportunity within the past day.
    const recentFeedID = this.checkPastDayFeed(this.VERIFIED_OPPORTUNITY, opportunity);
    // If there's a recentFeed, then update it instead with this user's info and return.
    if (recentFeedID) {
      this._updateVerifiedOpportunity(user, recentFeedID);
      return recentFeedID;
    }
    // Otherwise, define a new feed instance.
    const users = (_.isArray(user)) ? user : [user];
    const userIDs = _.uniq(Users.getIDs(users));
    const semesterID = Semesters.getID(semester);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `A student has been verified for
     [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)})
        (${Semesters.toString(semesterID, false)})${(userIDs.length > 1) ? ' along with some others.' : '.'}`;
    const picture = '/images/radgrad_logo.png';
    return this._collection.insert({
      userIDs, opportunityID, semesterID, description, timestamp, picture, feedType, retired,
    });
  }

  /**
   * Defines a new Feed (new course review).
   * @example
   * Feeds._defineNewCourseReview({ feedType: Feeds.NEW_COURSE_REVIEW,
   *                              user: 'abi@hawaii.edu',
   *                              course: 'ics111'
   *                              timestamp: '12345465465', });
   * @param { Object } description Object with keys user, course, feedType, and timestamp.
   * User can either be the string username or an array containing a single username.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course or user.
   */
  _defineNewCourseReview({
    user, course, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    let picture;
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `A student has added a course review for
     [${c.name}](./explorer/courses/${Slugs.getNameFromID(c.slugID)})`;
    picture = Users.getProfile(userID).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    return this._collection.insert({
      userIDs: [userID],
      courseID,
      description,
      timestamp,
      picture,
      feedType,
      retired,
    });
  }

  /**
   * Defines a new Feed (new opportunity review).
   * @example
   * Feeds._defineNewOpportunityReview({ feedType: Feeds.NEW_OPPORTUNITY_REVIEW,
   *                                   user: 'abi@hawaii.edu',
   *                                   opportunity: 'att-hackathon'
   *                                   timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, feedType, and timestamp.
   * User can either be the string username or an array containing a single username.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity or user.
   */
  _defineNewOpportunityReview({
    user, opportunity, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    let picture;
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `A student has added an opportunity review for 
      [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)})`;
    picture = Users.getProfile(userID).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    return this._collection.insert({
      userIDs: [userID], opportunityID, description, timestamp, picture, feedType, retired,
    });
  }

  /**
   * Defines a new Feed (new level).
   * @example
   * Feeds._defineNewLevel({ feedType: Feeds.NEW_LEVEL,
   *                         user: 'abi@hawaii.edu'
   *                         level: 6,
   *                      });
   * @param user the username.
   * @param level the new level.
   * @param feedType Feeds.NEW_LEVEL.
   * @param timestamp The time of the Feed.
   * @param retired the retired status.
   * @private
   */
  _defineNewLevel({
    user, level, feedType, timestamp = moment()
      .toDate(), retired,
  }) {
    // First, see if we've already defined any users within the past day.
    const recentFeedID = this.checkPastDayLevelFeed(level, timestamp);
    // If there's a recentFeed, then update it instead with this user's info.
    if (recentFeedID) {
      this._updateNewLevel(user, recentFeedID, level);
      return recentFeedID;
    }

    let picture;
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const description = `A student has achieved level ${level}.`;
    picture = Users.getProfile(userID).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    return this._collection.insert({
      userIDs: [userID], description, timestamp, picture, feedType, retired,
    });
  }

  /**
   * Returns a feedID with the same feedType (and opportunity, if feedType is Feeds.VERIFIED_OPPORTUNITY)
   * if it exists within the past 24 hours.
   * Returns false if no such feedID is found.
   * Opportunity is required only if feedType is Feeds.VERIFIED_OPPORTUNITY
   * @returns {Object} The feedID if found.
   * @returns {boolean} False if feedID is not found.
   */
  checkPastDayFeed(feedType, opportunity, timestamp = moment()
    .toDate()) {
    let ret = false;
    const instance = this;
    const existingFeed = _.find(this._collection.find()
      .fetch(), function (feed) {
      if (withinPastDay(feed, timestamp)) {
        if (feed.feedType === feedType) {
          if (feedType === instance.VERIFIED_OPPORTUNITY) {
            const opportunityID = Opportunities.getID(opportunity);
            if (opportunityID === feed.opportunityID) {
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

  checkPastDayLevelFeed(level, timestamp = moment()
    .toDate()) {
    let ret = false;
    const instance = this;
    const existingFeed = _.find(this._collection.find()
      .fetch(), function (feed) {
      if (withinPastDay(feed, timestamp)) {
        if (feed.feedType === instance.NEW_LEVEL) {
          // check the level
          if (feed.description.includes(`${level}.`)) {
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
   * @param username the new username the existing feed of the same type within the past 24 hours
   * @param existingFeedID the existing feed ID
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  _updateNewUser(username, existingFeedID) {
    const userID = Users.getID(username);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    let userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    userIDs = _.uniq(userIDs);
    const description = `A student and ${userIDs.length - 1} others have joined RadGrad.`;
    let picture = Users.getProfile(userIDs[0]).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    this._collection.update(existingFeedID, { $set: { userIDs, description, picture } });
  }

  _updateNewLevel(user, existingFeedID, level) {
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    let userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    userIDs = _.uniq(userIDs);
    const description = `A student and ${userIDs.length - 1} others have achieved level ${level}.`;
    let picture = Users.getProfile(userIDs[0]).picture;
    if (!picture || picture === '') {
      picture = defaultProfilePicture;
    }
    this._collection.update(existingFeedID, { $set: { userIDs, description, picture } });
  }

  /**
   * Updates the existingFeedID with the new userID information
   * @param username the new username the existing feed of the same type within the past 24 hours
   * @param existingFeedID the existing feed ID
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  _updateVerifiedOpportunity(username, existingFeedID) {
    const userID = Users.getID(username);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    let userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    userIDs = _.uniq(userIDs);
    const o = Opportunities.findDoc(existingFeed.opportunityID);
    const description = `A student and ${userIDs.length - 1} others have been verified for 
      [${o.name}](./explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) 
      (${Semesters.toString(existingFeed.semesterID, false)})`;
    this._collection.update(existingFeedID, { $set: { userIDs, description } });
  }

  /**
   * Removes all Feed documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    // There could be some collateral damage here, but whatever.
    this._collection.remove({ userIDs: { $in: [userID] } });
  }

  /**
   * Asserts that userId is logged in as an Admin, Faculty, Student, or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not in the allowed roles.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT, ROLE.FACULTY]);
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
    this.find()
      .forEach(doc => {
        _.forEach(doc.userIDs, userID => {
          if (!Users.isDefined(userID)) {
            problems.push(`Bad userID: ${userID}`);
          }
        });
        if (doc.opportunityID && !Opportunities.isDefined(doc.opportunityID)) {
          problems.push(`Bad opportunityID: ${doc.opportunityID}`);
        }
        if (doc.courseID && !Courses.isDefined(doc.courseID)) {
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
      user = _.map(doc.userIDs, userID => Users.getProfile(userID).username);
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
    const retired = doc.retired;
    return { user, opportunity, course, semester, feedType, timestamp, retired };
  }

  /**
   * Publish a maximum of the last 25 feeds to users
   */
  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, () => this._collection.find({}, { sort: { timestamp: -1 }, limit: 25 }));
    }
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/feed
 */
export const Feeds = new FeedCollection();
