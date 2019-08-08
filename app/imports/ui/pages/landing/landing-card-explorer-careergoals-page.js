import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

Template.Landing_Card_Explorer_CareerGoals_Page.helpers({
  addedCareerGoals() {
    return CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  },
  nonAddedCareerGoals() {
    return [];
  },
});
