import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Feeds } from '../../../api/feed/FeedCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

// /** @module ui/components/admin/Add_User_Widget */

const addSchema = new SimpleSchema({
  firstName: { type: String, optional: false },
  lastName: { type: String, optional: false },
  role: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  email: { type: String, optional: false },
  uhID: { type: String, optional: false },
  // remaining are optional.
  password: { type: String, optional: true },
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: [String], optional: true },
  interests: { type: [String], optional: true },
  website: { type: String, optional: true },
});

Template.Add_User_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_User_Widget.helpers({
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
});

Template.Add_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      ValidUserAccounts.define({ username: newData.slug });
      Meteor.call('Users.define', newData, (error) => {
        if (error) {
          console.log('Error during new user creation: ', error);
        }
        const timestamp = new Date().getTime();
        if (Feeds.checkPastDayFeed(timestamp, 'new-user')) {
          Feeds.updateNewUser(newData.slug, Feeds.checkPastDayFeed(timestamp, 'new-user'));
        } else {
          const feedDefinition = {
            user: [newData.slug],
            feedType: 'new-user',
            timestamp,
          };
          Feeds.define(feedDefinition);
        }
        FormUtils.indicateSuccess(instance, event);
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
