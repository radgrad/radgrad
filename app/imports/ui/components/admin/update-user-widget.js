import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { updateUserMethod } from '../../../api/user/UserCollection.methods';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_User_Widget */

const updateSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  slug: String, // will rename this to username
  role: String,
  email: String,
  uhID: String,
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: [String],
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  website: { type: String, optional: true },
}, { tracker: Tracker });

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
    instance.context.reset();
    updateSchema.clean(updatedData, { mutate: true });
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      const oldRole = Roles.getRolesForUser(Template.currentData().updateID.get());
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'careerGoals', 'careerGoalIDs');
      FormUtils.renameKey(updatedData, 'desiredDegree', 'desiredDegreeID');
      FormUtils.renameKey(updatedData, 'slug', 'username');
      updateUserMethod.call(updatedData, (error) => {
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
