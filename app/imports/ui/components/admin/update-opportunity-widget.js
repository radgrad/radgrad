import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { getGroupName } from '../shared/route-group-name';

const updateSchema = new SimpleSchema({
  name: String,
  description: String,
  opportunityType: String,
  sponsor: String,
  innovation: { type: Number, min: 0, max: 25 },
  competency: { type: Number, min: 0, max: 25 },
  experience: { type: Number, min: 0, max: 25 },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  semesters: { type: Array, minCount: 1 }, 'semesters.$': String,
  retired: { type: Boolean },
}, { tracker: Tracker });

Template.Update_Opportunity_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Opportunity_Widget.helpers({
  opportunityTypes() {
    return OpportunityTypes.find({}, { sort: { name: 1 } });
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  admin() {
    const group = getGroupName();
    return group === 'admin';
  },
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
  },
  sponsors() {
    const usernames = Roles.getUsersInRole([ROLE.FACULTY, ROLE.ADVISOR]).map(user => user.username);
    // get the profiles, sorted by last name.
    const profiles = _.sortBy(_.map(usernames, username => Users.getProfile(username)), profile => profile.lastName);
    const accounts = _.map(profiles, profile => Meteor.users.findOne({ username: profile.username }));
    return accounts;
  },
  slug() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(opportunity.slugID).name;
  },
  opportunity() {
    return Opportunities.findDoc(Template.currentData().updateID.get());
  },
  selectedInterestIDs() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return opportunity.interestIDs;
  },
  selectedSemesterIDs() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return opportunity.semesterIDs;
  },
  faculty() {
    const group = getGroupName();
    return group === 'faculty';
  },
  falseValueRetired() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return !opportunity.retired;
  },
  trueValueRetired() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return opportunity.retired;
  },
});

Template.Update_Opportunity_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    if (updateData.retired === 'true') {
      updateData.retired = true;
    } else {
      updateData.retired = false;
    }
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updateData);
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'OpportunityCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      console.log('Error');
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
