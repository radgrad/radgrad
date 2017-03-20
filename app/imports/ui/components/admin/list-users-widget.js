import { Template } from 'meteor/templating';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { Roles } from 'meteor/alanning:roles';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

// TODO: implement numReferences to enable the delete operation.
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
    return user && (numReferences(user) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return slugID && Slugs.findDoc(slugID).name;
  },

  fullName(user) {
    const roles = Roles.getRolesForUser(user);
    return user && `${user.lastName}, ${user.firstName} (${roles})`;
  },
  /**
   * Users are currently defined in two steps: an initial create with only a few fields, then a subsequent $set
   * to add the remaining fields. Because of this two-step process for creating users, the descriptionPairs method
   * will be called twice, once with a "partial" user document followed by a call with the complete user document.
   * To prevent descriptionPairs from calling methods like CareerGoals.findNames with the undefined value due to
   * the "partial" user document, the existence of a "complete" user document is checked before constructing the array.
   */
  descriptionPairs(user) {
    return user.careerGoalIDs && [
      { label: 'Username', value: user.username },
      { label: 'Email', value: user.email },
      { label: 'UH ID', value: user.uhID },
      { label: 'Degree', value: (user.desiredDegreeID) ? DesiredDegrees.findDoc(user.desiredDegreeID).name : '' },
      { label: 'Picture', value: makeLink(user.picture) },
      { label: 'Level', value: user.level },
      { label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(user.careerGoalIDs)) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(user.interestIDs)) },
      { label: 'Website', value: makeLink(user.website) },
    ];
  },
});

Template.List_Users_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Users.removeIt(id);
  },
});
