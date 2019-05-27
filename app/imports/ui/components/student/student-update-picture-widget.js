import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { RadGrad } from '../../../api/radgrad/RadGrad';
import { defaultCalcLevel } from '../../../api/level/LevelProcessor';
import { openCloudinaryWidget } from '../form-fields/open-cloudinary-widget';
import * as FormUtils from '../form-fields/form-field-utilities';

const updateSchema = new SimpleSchema({
  picture: String,
});

Template.Student_Update_Picture_Widget.onCreated(function studentupdatepicturewidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Student_Update_Picture_Widget.helpers({
  picture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.picture;
    }
    return '';
  },
});

Template.Student_Update_Picture_Widget.events({
  'submit .picture': function submitPicture(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    updateData.id = profile._id;
    console.log('Student_Update_Picture_Widget %o', updateData);
    if (updateData.picture === '') {
      updateData.picture = defaultProfilePicture;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error during Student profile picture update', error);
      } else {
       // alert('Picture update successful.');
        let level;
        if (RadGrad.calcLevel) {
          level = RadGrad.calcLevel(profile.userID);
        } else {
          level = defaultCalcLevel(profile.userID);
        }
        updateData.level = level;
        // console.log(`submit picture ${level}`);
        updateMethod.call({ collectionName, updateData });
      }
    });
  },
  'click #image-upload-widget': function clickUpload(event) {
    event.preventDefault();
    openCloudinaryWidget('picture');
  },
});

Template.Student_Update_Picture_Widget.onRendered(function studentupdatepicturewidgetOnRendered() {
  // add your statement here
});

Template.Student_Update_Picture_Widget.onDestroyed(function studentupdatepicturewidgetOnDestroyed() {
  // add your statement here
});

