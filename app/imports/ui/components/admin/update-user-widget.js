import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_User_Widget */

const updateSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  slug: String, // will rename this to username
  role: String,
  email: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  uhID: { type: String, optional: true },
  // year: { type: Number, optional: true },
  academicPlan: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: [String],
  website: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_User_Widget.onCreated(function onCreated() {
  this.chosenYear = new ReactiveVar('');
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_User_Widget.helpers({
  user() {
    return Users.findDoc(Template.currentData().updateID.get());
  },
  userID() {
    return Template.currentData().updateID;
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  roles() {
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN]));
  },
  semesters() {
    return Semesters.find({});
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
  selectedSemesterID() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.declaredSemesterID;
  },
  selectedRole() {
    const user = Users.findDoc(Template.currentData().updateID.get());
    return user.roles[0];
  },
});

Template.Update_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updateData, 'slug', 'username');
      FormUtils.renameKey(updateData, 'academicPlan', 'academicPlanID');
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'UserCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'change [name=year]': function changeYear(event, instance) {
    event.preventDefault();
    instance.successClass.set('');
    instance.errorClass.set('');
    Template.instance().chosenYear.set($(event.target).val());
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
