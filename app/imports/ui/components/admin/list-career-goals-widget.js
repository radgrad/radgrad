import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

Template.List_Career_Goals_Widget.onCreated(function listCareerGoalsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
});

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find();
  },
})
