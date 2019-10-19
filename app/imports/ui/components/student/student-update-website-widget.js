import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities';

const updateSchema = new SimpleSchema({
  website: String,
});

Template.Student_Update_Website_Widget.onCreated(function studentupdatewebsitewidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Student_Update_Website_Widget.helpers({
  website() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.website;
    }
    return '';
  },
});

Template.Student_Update_Website_Widget.events({
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    updateData.id = profile._id;
    // console.log('Student_Update_Website_Widget %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error during Student profile website update', error);
      } else {
        // alert('Website update successful.');
      }
    });
  },
});

Template.Student_Update_Website_Widget.onRendered(function studentupdatewebsitewidgetOnRendered() {
  // add your statement here
});

Template.Student_Update_Website_Widget.onDestroyed(function studentupdatewebsitewidgetOnDestroyed() {
  // add your statement here
});
