import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';

Template.List_Career_Goals_Widget.onCreated(function onCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

function numReferences(careerGoal) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.careerGoalIDs, careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  count() {
    return CareerGoals.count();
  },
  deleteDisabled(careerGoal) {
    return (numReferences(careerGoal) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
      { label: 'More Information', value: makeLink(careerGoal.moreInformation) },
      { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
    ];
  },
});

Template.List_Career_Goals_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    CareerGoals.removeIt(id);
  },
});
