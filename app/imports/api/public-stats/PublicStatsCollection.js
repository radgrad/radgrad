import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection';
import { MentorProfiles } from '../user/MentorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { Reviews } from '../review/ReviewCollection';
import { Users } from '../user/UserCollection';
import { Slugs } from '../slug/SlugCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';

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
 * @extends api/base.BaseCollection
 * @memberOf api/public-stats
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
    this.firstAcademicPlanKey = 'firstAcademicPlan';
    this.stats.push(this.firstAcademicPlanKey);
    this.firstCareerGoalKey = 'firstCareerGoal';
    this.stats.push(this.firstCareerGoalKey);
    this.firstInterestKey = 'firstInterest';
    this.stats.push(this.firstInterestKey);
    this.firstOpportunityKey = 'firstOpportunity';
    this.stats.push(this.firstOpportunityKey);
    this.firstDegreeKey = 'firstDegree';
    this.stats.push(this.firstDegreeKey);
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
    const opps = Opportunities.find().fetch();
    const notRetired = _.filter(opps, (o) => !o.retired);
    const numOpps = notRetired.length;
    this._collection.upsert({ key: this.opportunitiesTotalKey }, { $set: { value: `${numOpps}` } });
  }

  opportunitiesProjectsTotal() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const opps = Opportunities.find({ opportunityTypeID: projectType._id }).fetch();
    const notRetired = _.filter(opps, (o) => !o.retired);
    const numProjects = notRetired.length;
    this._collection.upsert({ key: this.opportunitiesProjectsTotalKey }, { $set: { value: `${numProjects}` } });
  }

  opportunitiesProjectsList() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const opps = Opportunities.find({ opportunityTypeID: projectType._id }).fetch();
    const notRetired = _.filter(opps, (o) => !o.retired);
    const names = _.map(notRetired, 'name');
    this._collection.upsert({ key: this.opportunitiesProjectsListKey }, { $set: { value: names.join(', ') } });
  }

  upsertLevelTotal(level, key) {
    const numUsers = StudentProfiles.find({ level }).count();
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
    const numUsers = Users.findProfiles().length;
    this._collection.upsert({ key: this.usersTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersStudentsTotal() {
    const numUsers = StudentProfiles.find().count();
    this._collection.upsert({ key: this.usersStudentsTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersFacultyTotal() {
    const numUsers = FacultyProfiles.find().count();
    this._collection.upsert({ key: this.usersFacultyTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersMentorsTotal() {
    const numUsers = MentorProfiles.find().count();
    this._collection.upsert({ key: this.usersMentorsTotalKey }, { $set: { value: `${numUsers}` } });
  }

  usersMentorsProfessionsList() {
    let professions = [];
    MentorProfiles.find().forEach(profile => professions.push(profile.career));
    professions = _.union(professions);
    this._collection.upsert({ key: this.usersMentorsProfessionsListKey }, { $set: { value: professions.join(', ') } });
  }

  usersMentorsLocations() {
    let locations = [];
    MentorProfiles.find().forEach(profile => locations.push(profile.location));
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
    _.forEach(courseReviews, (review) => {
      const course = Courses.findDoc(review.revieweeID);
      courseNumbers.push(course.number);
    });
    courseNumbers = _.union(courseNumbers);
    if (courseNumbers) {
      this._collection.upsert({ key: this.courseReviewsCoursesKey }, { $set: { value: courseNumbers.join(', ') } });
    }
  }

  firstAcademicPlan() {
    let planName = '';
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    const plan = AcademicPlans.findOne({ semesterNumber });
    if (plan) {
      planName = (Slugs.findDoc(plan.slugID)).name;
    }
    this._collection.upsert({ key: this.firstAcademicPlanKey }, { $set: { value: planName } });
  }

  firstCareerGoal() {
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      const name = Slugs.findDoc(careerGoals[0].slugID).name;
      this._collection.upsert({ key: this.firstCareerGoalKey }, { $set: { value: name } });
    }
  }

  firstInterest() {
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      const name = Slugs.findDoc(interests[0].slugID).name;
      this._collection.upsert({ key: this.firstInterestKey }, { $set: { value: name } });
    }
  }

  firstOpportunity() {
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const notRetired = _.filter(opps, (o) => !o.retired);
    if (notRetired.length > 0) {
      const name = Slugs.findDoc(notRetired[0].slugID).name;
      this._collection.upsert({ key: this.firstOpportunityKey }, { $set: { value: name } });
    }
  }

  firstDegree() {
    const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
    if (degrees.length > 0) {
      const name = Slugs.findDoc(degrees[0].slugID).name;
      this._collection.upsert({ key: this.firstDegreeKey }, { $set: { value: name } });
    }
  }

  generateStats() {
    if (!Meteor.isAppTest) {
      const instance = this;
      _.forEach(this.stats, (key) => {
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
 * @type {api/public-stats.PublicStatsCollection}
 * @memberOf api/public-stats
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
