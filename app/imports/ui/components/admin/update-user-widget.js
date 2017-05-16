import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

// /** @module ui/components/admin/Update_User_Widget */

const updateSchema = new SimpleSchema({
  firstName: { type: String, optional: false },
  lastName: { type: String, optional: false },
  slug: { type: String, optional: false }, // will rename this to username
  role: { type: String, optional: false },
  email: { type: String, optional: false },
  uhID: { type: String, optional: false },
  // remaining are optional.
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: [String], optional: true },
  interests: { type: [String], optional: true },
  website: { type: String, optional: true },
});

Template.Update_User_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_User_Widget.helpers({
  user() {
    return Users.findDoc(Template.currentData().updateID.get());
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  desiredDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } });
  },
  roles() {
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN]));
  },
  slug() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(user.slugID).name;
  },
  selectedInterestIDs() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.interestIDs;
  },
  selectedCareerGoalIDs() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.careerGoalIDs;
  },
  selectedDesiredDegreeID() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.desiredDegreeID;
  },
  selectedRole() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.roles[0];
  },
});

Template.Update_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      const oldRole = Roles.getRolesForUser(Template.currentData().updateID.get());
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'careerGoals', 'careerGoalIDs');
      FormUtils.renameKey(updatedData, 'desiredDegree', 'desiredDegreeID');
      FormUtils.renameKey(updatedData, 'slug', 'username');
      Meteor.call('Users.update', updatedData, (error) => {
        if (error) {
          console.log('Error during user update: ', error);
        }
        FormUtils.indicateSuccess(instance, event);
      });
      if (oldRole !== updatedData.role) {
        Users.updateRole(Template.currentData().updateID.get(), [updatedData.role], oldRole);
      }
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
