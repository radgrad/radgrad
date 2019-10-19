import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';

Template.Details_Card.onCreated(function detailsCardOnCreated() {
  this.state = this.data.dictionary;
});

Template.Details_Card.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  hasSelection() {
    const { state } = Template.instance();
    return state.get(plannerKeys.detailsOpportunity) || state.get(plannerKeys.detailsCourse);
  },
  selectedCourse() {
    const { state } = Template.instance();
    return state.get(plannerKeys.detailsCourse);
  },
  selectedOpportunity() {
    const { state } = Template.instance();
    return state.get(plannerKeys.detailsOpportunity);
  },
});

Template.Details_Card.events({
  // add your events here
});

Template.Details_Card.onRendered(function detailsCardOnRendered() {
  // add your statement here
});

Template.Details_Card.onDestroyed(function detailsCardOnDestroyed() {
  // add your statement here
});
