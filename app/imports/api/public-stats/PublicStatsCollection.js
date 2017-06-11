import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection';
import { MentorProfiles } from '../mentor/MentorProfileCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { Reviews } from '../review/ReviewCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';

/** @module api/public-stats/PublicStatsCollection */

/**
 * PublicStats holds statistics about RadGrad that can be accessed without logging in.
 * These are referenced in the landing page and the guided tour.
 * Basically, the collection is a set of documents with two fields: key and value.
 * The field this.stats holds a list of strings which define the set of legal keys.
 * Each of these strings is also the name of a method in this class which is responsible for calculating the value
 * associated with the key and then upserting the key-value pair into the collection.
 *
 * See startup/server/initialize-db.js for the code that starts a cron job that updates this collection when the
 * system starts up and once a day thereafter.
 *
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class PublicStatsCollection extends BaseCollection {
  /**
   * Creates the PublicStats collection.
   */
  constructor() {
    super('PublicStats', new SimpleSchema({
      key: { type: String },
      value: { type: String },
    }));
    this.stats = [];
    this.coursesTotalKey = 'coursesTotal';
    this.stats.push(this.coursesTotalKey);
    this.careerGoalsTotalKey = 'careerGoalsTotal';
    this.stats.push(this.careerGoalsTotalKey);
    this.careerGoalsListKey = 'careerGoalsList';
    this.stats.push(this.careerGoalsListKey);
    this.desiredDegreesTotalKey = 'desiredDegreesTotal';
    this.stats.push(this.desiredDegreesTotalKey);
    this.desiredDegreesListKey = 'desiredDegreesList';
    this.stats.push(this.desiredDegreesListKey);
    this.interestsTotalKey = 'interestsTotal';
    this.stats.push(this.interestsTotalKey);
    this.interestsListKey = 'interestsList';
    this.stats.push(this.interestsListKey);
    this.opportunitiesTotalKey = 'opportunitiesTotal';
    this.stats.push(this.opportunitiesTotalKey);
    this.opportunitiesProjectsTotalKey = 'opportunitiesProjectsTotal';
    this.stats.push(this.opportunitiesProjectsTotalKey);
    this.opportunitiesProjectsListKey = 'opportunitiesProjectsList';
    this.stats.push(this.opportunitiesProjectsListKey);
    this.usersTotalKey = 'usersTotal';
    this.stats.push(this.usersTotalKey);
    this.usersStudentsTotalKey = 'usersStudentsTotal';
    this.stats.push(this.usersStudentsTotalKey);
    this.usersFacultyTotalKey = 'usersFacultyTotal';
    this.stats.push(this.usersFacultyTotalKey);
    this.usersMentorsTotalKey = 'usersMentorsTotal';
    this.stats.push(this.usersMentorsTotalKey);
    this.usersMentorsProfessionsListKey = 'usersMentorsProfessionsList';
    this.stats.push(this.usersMentorsProfessionsListKey);
    this.usersMentorsLocationsKey = 'usersMentorsLocations';
    this.stats.push(this.usersMentorsLocationsKey);
    this.courseReviewsTotalKey = 'courseReviewsTotal';
    this.stats.push(this.courseReviewsTotalKey);
    this.courseReviewsCoursesKey = 'courseReviewsCourses';
    this.stats.push(this.courseReviewsCoursesKey);
    this.levelOneTotalKey = 'levelOneTotal';
    this.stats.push(this.levelOneTotalKey);
    this.levelTwoTotalKey = 'levelTwoTotal';
    this.stats.push(this.levelTwoTotalKey);
    this.levelThreeTotalKey = 'levelThreeTotal';
    this.stats.push(this.levelThreeTotalKey);
    this.levelFourTotalKey = 'levelFourTotal';
    this.stats.push(this.levelFourTotalKey);
    this.levelFiveTotalKey = 'levelFiveTotal';
    this.stats.push(this.levelFiveTotalKey);
    this.levelSixTotalKey = 'levelSixTotal';
    this.stats.push(this.levelSixTotalKey);
  }

  careerGoalsTotal() {
    const count = CareerGoals.find().count();
    this._collection.upsert({ key: this.careerGoalsTotalKey }, { $set: { value: `${count}` } });
  }

  coursesTotal() {
    const count = Courses.find().count();
    this._collection.upsert({ key: this.coursesTotalKey }, { $set: { value: `${count}` } });
  }

  careerGoalsList() {
    const goals = CareerGoals.find().fetch();
    const names = _.map(goals, 'name');
    this._collection.upsert({ key: this.careerGoalsListKey }, { $set: { value: names.join(', ') } });
  }

  desiredDegreesTotal() {
    const count = DesiredDegrees.find().count();
    this._collection.upsert({ key: this.desiredDegreesTotalKey }, { $set: { value: `${count}` } });
  }

  desiredDegreesList() {
    const degrees = DesiredDegrees.find().fetch();
    const names = _.map(degrees, 'name');
    this._collection.upsert({ key: this.desiredDegreesListKey }, { $set: { value: names.join(', ') } });
  }

  interestsTotal() {
    const numInterests = Interests.find().count();
    this._collection.upsert({ key: this.interestsTotalKey }, { $set: { value: `${numInterests}` } });
  }

  interestsList() {
    const interests = Interests.find().fetch();
    const names = _.map(interests, 'name');
    this._collection.upsert({ key: this.interestsListKey }, { $set: { value: names.join(', ') } });
  }

  opportunitiesTotal() {
    const numOpps = Opportunities.find().count();
    this._collection.upsert({ key: this.opportunitiesTotalKey }, { $set: { value: `${numOpps}` } });
  }

  opportunitiesProjectsTotal() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const numProjects = Opportunities.find({ opportunityTypeID: projectType._id }).count();
    this._collection.upsert({ key: this.opportunitiesProjectsTotalKey }, { $set: { value: `${numProjects}` } });
  }

  opportunitiesProjectsList() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const projects = Opportunities.find({ opportunityTypeID: projectType._id }).fetch();
    const names = _.map(projects, 'name');
    this._collection.upsert({ key: this.opportunitiesProjectsListKey }, { $set: { value: names.join(', ') } });
  }

  upsertLevelTotal(level, key) {
    const numUsers = Users.find({ level }).count();
    this._collection.upsert({ key }, { $set: { value: `${numUsers}` } });
  }

  levelOneTotal() {
    this.upsertLevelTotal(1, this.levelOneTotalKey);
  }

  levelTwoTotal() {
    this.upsertLevelTotal(2, this.levelTwoTotalKey);
  }

  levelThreeTotal() {
    this.upsertLevelTotal(3, this.levelThreeTotalKey);
  }

  levelFourTotal() {
    this.upsertLevelTotal(4, this.levelFourTotalKey);
  }

  levelFiveTotal() {
    this.upsertLevelTotal(5, this.levelFiveTotalKey);
  }

  levelSixTotal() {
    this.upsertLevelTotal(6, this.levelSixTotalKey);
  }

  usersTotal() {
    const numUsers = Users.find().count();
    this._collection.upsert({ key: this.usersTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersStudentsTotal() {
    const numUsers = Users.find({ roles: [ROLE.STUDENT] }).count();
    this._collection.upsert({ key: this.usersStudentsTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersFacultyTotal() {
    const numUsers = Users.find({ roles: [ROLE.FACULTY] }).count();
    this._collection.upsert({ key: this.usersFacultyTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersMentorsTotal() {
    const numUsers = Users.find({ roles: [ROLE.MENTOR] }).count();
    this._collection.upsert({ key: this.usersMentorsTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersMentorsProfessionsList() {
    const mentors = Users.find({ roles: [ROLE.MENTOR] }).fetch();
    let professions = [];
    _.map(mentors, (m) => {
      const profile = MentorProfiles.findDoc({ mentorID: m._id });
      professions.push(profile.career);
    });
    professions = _.union(professions);
    this._collection.upsert({ key: this.usersMentorsProfessionsListKey }, { $set: { value: professions.join(', ') } });
  }

  usersMentorsLocations() {
    const mentors = Users.find({ roles: [ROLE.MENTOR] }).fetch();
    let locations = [];
    _.map(mentors, (m) => {
      const profile = MentorProfiles.findDoc({ mentorID: m._id });
      locations.push(profile.location);
    });
    locations = _.union(locations);
    this._collection.upsert({ key: this.usersMentorsLocationsKey }, { $set: { value: locations.join(', ') } });
  }

  courseReviewsTotal() {
    const numCourseReviews = Reviews.find({ reviewType: 'course' }).count();
    this._collection.upsert({ key: this.courseReviewsTotalKey }, { $set: { value: `${numCourseReviews}` } });
  }

  courseReviewsCourses() {
    const courseReviews = Reviews.find({ reviewType: 'course' }).fetch();
    let courseNumbers = [];
    _.map(courseReviews, (review) => {
      const course = Courses.findDoc(review.revieweeID);
      courseNumbers.push(course.number);
    });
    courseNumbers = _.union(courseNumbers);
    if (courseNumbers) {
      this._collection.upsert({ key: this.courseReviewsCoursesKey }, { $set: { value: courseNumbers.join(', ') } });
    }
  }

  generateStats() {
    if (!Meteor.isAppTest) {
      const instance = this;
      _.map(this.stats, (key) => {
        instance[key]();
      });
    }
  }

  /**
   * Returns an empty array to indicate no integrity checking.
   * @returns {Array} An empty array.
   */
  checkIntegrity() {  // eslint-disable-line class-methods-use-this
    return [];
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const PublicStats = new PublicStatsCollection();

/**
 * Create a global helper called publicStats that returns the value associated with the passed key.
 */
if (Meteor.isClient) {
  Template.registerHelper('publicStats', (key) => {
    const stat = PublicStats.isDefined({ key }) && PublicStats.findDoc({ key });
    if (stat) {
      return stat.value;
    }
    return null;
  });
}
