import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';

/** @module ui/components/admin/List_Users_Widget */

Template.List_Users_Widget.helpers({
  users() {
    return Users.findProfiles({}, { sort: { lastName: 1 } });
  },
  count() {
    return Users.findProfiles().length;
  },
  deleteDisabled(user) {
    return user && (Users.isReferenced(user.username)) ? 'disabled' : '';
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
      { label: 'Username (Slug)', value: user.username },
      { label: 'Email', value: user.email },
      { label: 'UH ID', value: user.uhID },
      { label: 'Picture', value: makeLink(user.picture) },
      { label: 'Level', value: user.level },
      { label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(user.careerGoalIDs)) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(user.interestIDs)) },
      { label: 'Website', value: makeLink(user.website) },
      { label: 'Degree', value: (user.academicPlanID) ? AcademicPlans.findDoc(user.academicPlanID).name : '' },
      { label: 'Declared Semester', value: (user.declaredSemesterID) ?
          Semesters.toString(user.declaredSemesterID) : '' },
    ];
  },
});

Template.List_Users_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'UserCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
