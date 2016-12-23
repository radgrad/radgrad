import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Tracker } from 'meteor/tracker';

Template.List_Career_Goals_Widget.onCreated(function listCareerGoalsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

function getReferences(careerGoalID) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.careerGoalIDs, careerGoalID)) {
      references += 1;
    }
  });
  return `Users: ${references}`;
}

function hasReferences(careerGoalID) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.careerGoalIDs, careerGoalID)) {
      references += 1;
    }
  });
  return references > 0;
}

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  count() {
    return CareerGoals.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
      { label: 'More Information', value: `<a href="${careerGoal.moreInformation}">${careerGoal.moreInformation}</a>` },
      { label: 'References', value: getReferences(careerGoal._id) },
    ];
  },
});

Template.List_Career_Goals_Widget.onRendered(function listCareerGoalsWidgetOnRendered() {
});

Template.List_Career_Goals_Widget.events({
  'click .jsUpdate': function (event, instance) {
    event.preventDefault();
    const careerGoalID = event.target.value;
    instance.data.updateID.set(careerGoalID);
  },
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const careerGoalID = event.target.value;
    if (hasReferences(careerGoalID)) {
      alert('Cannot delete an entity that is referred to by another entity.');
    } else {
      CareerGoals.removeIt(careerGoalID);
    }
  },
});
