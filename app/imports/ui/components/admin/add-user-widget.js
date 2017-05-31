import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import {
  feedsDefineNewUserMethod,
  feedsUpdateNewUserMethod,
} from '../../../api/feed/FeedCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import { defineUserMethod } from '../../../api/user/UserCollection.methods';
import { validUserAccountsDefineMethod } from '../../../api/user/ValidUserAccountCollection.methods';
import * as FormUtils from './form-fields/form-field-utilities.js';

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
      validUserAccountsDefineMethod.call({ username: newData.slug }, (error) => {
        if (error) {
          console.log('Error during new user creation ValidUserAccounts: ', error);
        }
      });
      defineUserMethod.call(newData, (error) => {
        if (error) {
          console.log('Error during new user creation: ', error);
        }
        if (Feeds.checkPastDayFeed('new-user')) {
          feedsUpdateNewUserMethod({ username: newData.slug, existingFeedID: Feeds.checkPastDayFeed('new-user') },
              (err) => {
                if (err) {
                  console.log('Error updating new user Feed', err);
                }
              });
        } else {
          const feedDefinition = {
            user: [newData.slug],
            feedType: 'new-user',
          };
          feedsDefineNewUserMethod.call(feedDefinition);
        }
        FormUtils.indicateSuccess(instance, event);
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
