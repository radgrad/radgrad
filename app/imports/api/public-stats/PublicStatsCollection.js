import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '/imports/api/base/BaseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';


class PublicStatsCollection extends BaseCollection {
  /**
   * Creates the PublicStats collection.
   */
  constructor() {
    super('PublicStats', new SimpleSchema({
      key: { type: String },
      value: { type: String },
    }));
    this.careerGoalsTotalKey = 'careerGoalsTotal';
    this.careerGoalsListKey = 'careerGoalsList';
    this.interestsTotalKey = 'interestsTotal';
    this.interestsListKey = 'interestsList';
    this.opportunitiesTotalKey = 'opportunitiesTotal';
    this.opportunitiesProjectsTotalKey = 'opportunitiesProjectsTotal';
    this.opportunitiesProjectsListKey = 'opportunitiesProjectsList';
    this.usersTotalKey = 'usersTotal';
    this.usersStudentsTotalKey = 'usersStudentsTotal';
    this.usersFacultyTotalKey = 'usersFacultyTotal';
    this.usersMentorsTotalKey = 'usersMentorsTotal';
    this.usersMentorsProfessionsListKey = 'usersMentorsProfessionsList';
    this.usersMentorsLocationsKey = 'usersMentorsLocations';
    this.courseReviewsTotalKey = 'courseReviewsTotal';
    this.courseReviewsCoursesKey = 'courseReviewsCourses';
  }

  _clearKey(key) {
    const cgt = this._collection.findOne({ key });
    if (cgt) {
      this.removeIt(cgt._id);
    }
  }

  /**
   * Upserts the careerGoalsTotal statistic.
   */
  careerGoalsTotal() {
    this._clearKey(this.careerGoalsTotalKey);
    const count = CareerGoals.find().count();
    this._collection.insert({
      key: this.careerGoalsTotalKey,
      value: `${count}`,
    });
  }

  /**
   * Upserts the careerGoalsList statistic.
   */
  careerGoalsList() {
    this._clearKey(this.careerGoalsTotalKey);
    const goals = CareerGoals.find().fetch();
    this._collection.insert({
      key: this.careerGoalsListKey,
      value: goals.join(', '),
    });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const PublicStats = new PublicStatsCollection();
