import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';


Template.Landing_Explorer_CareerGoals_Page.onCreated(function landingExplorerCareerGoalsPageOnCreated() {
  // console.log('landingExplorerCareerGoalsPageOnCreated', this.data);
});

Template.Landing_Explorer_CareerGoals_Page.helpers({
  addedCareerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  },
  careerGoal() {
    const careerGoalSlugName = FlowRouter.getParam('careerGoal');
    const slug = Slugs.findDoc({ name: careerGoalSlugName });
    const careerGoal = CareerGoals.findDoc({ slugID: slug._id });
    return careerGoal;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    ];
  },
  nonAddedCareerGoals() {
    return [];
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(careerGoal) { // eslint-disable-line
    return [];
  },
});

