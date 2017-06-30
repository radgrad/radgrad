import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { validUserAccountsDefineMethod } from '../../../api/user/ValidUserAccountCollection.methods';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_User_Widget */

const addSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  role: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  email: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  // Everything else is optional.
  uhID: { type: String, optional: true },
  password: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  website: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
}, { tracker: Tracker });

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
  roles() {
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN]));
  },
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: -1 } });
  },
});

Template.Add_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      validUserAccountsDefineMethod.call({ username: newData.slug }, () => {
        defineMethod.call({ collectionName: 'UserCollection', definitionData: newData }, (error) => {
          if (error) {
            FormUtils.indicateError(instance, error);
          } else {
            const feedData = { feedType: 'new-user', user: newData.slug };
            defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
            FormUtils.indicateSuccess(instance, event);
          }
        });
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
