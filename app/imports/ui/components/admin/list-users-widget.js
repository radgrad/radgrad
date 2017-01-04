import { Template } from 'meteor/templating';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { Roles } from 'meteor/alanning:roles';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.List_Users_Widget.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

function numReferences() {
  const references = 1;
  return references;
}

Template.List_Users_Widget.helpers({
  users() {
    return Users.find({}, { sort: { lastName: 1 } });
  },
  count() {
    return Users.count();
  },
  deleteDisabled(user) {
    return (numReferences(user) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },

  fullName(user) {
    const roles = Roles.getRolesForUser(user);
    return `${user.lastName}, ${user.firstName} (${roles})`;
  },
  descriptionPairs(user) {
    return [
      { label: 'Username', value: user.username },
      { label: 'Email', value: user.email },
      { label: 'UH ID', value: user.uhID },
      { label: 'Desired Degree', value: user.desiredDegree },
      { label: 'Picture', value: makeLink(user.picture) },
      { label: 'Level', value: user.level },
      { label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(user.careerGoalIDs)) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(user.interestIDs)) },
      { label: 'Website', value: makeLink(user.website) },
    ];
  },
});

Template.List_Career_Goals_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Users.removeIt(id);
  },
});
