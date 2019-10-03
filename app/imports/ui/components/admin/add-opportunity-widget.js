import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getGroupName } from '../shared/route-group-name';

const addSchema = new SimpleSchema({
  name: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  description: String,
  opportunityType: String,
  sponsor: String,
  innovation: { type: Number, min: 0, max: 25 },
  competency: { type: Number, min: 0, max: 25 },
  experience: { type: Number, min: 0, max: 25 },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  semesters: { type: Array, minCount: 1 }, 'semesters.$': String,
}, { tracker: Tracker });

Template.Add_Opportunity_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Opportunity_Widget.helpers({
  opportunityTypes() {
    return OpportunityTypes.find({}, { sort: { name: 1 } });
  },
  faculty() {
    const group = getGroupName();
    return group === 'faculty';
  },
  admin() {
    const group = getGroupName();
    return group === 'admin';
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
  },
  sponsor() {
    const group = getGroupName();
    if (group === 'faculty') {
      return getUserIdFromRoute();
    }
    return '';
  },
  sponsors() {
    const usernames = Roles.getUsersInRole([ROLE.FACULTY, ROLE.ADVISOR]).map(user => user.username);
    // get the profiles, sorted by last name.
    const profiles = _.sortBy(_.map(usernames, username => Users.getProfile(username)), profile => profile.lastName);
    const accounts = _.map(profiles, profile => Meteor.users.findOne({ username: profile.username }));
    return accounts;
  },
});

Template.Add_Opportunity_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(newData);
      defineMethod.call({ collectionName: Opportunities.getCollectionName(), definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
          const feedData = { feedType: Feeds.NEW_OPPORTUNITY, opportunity: newData.slug };
          defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
