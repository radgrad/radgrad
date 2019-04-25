import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import * as FormUtils from '../form-fields/form-field-utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const updateSharingSchema = new SimpleSchema({
  shareUsername: Boolean,
  sharePicture: Boolean,
  shareWebsite: Boolean,
  shareCareerGoals: Boolean,
  shareInterests: Boolean,
  shareAcademicPlan: Boolean,
  shareCourses: Boolean,
  shareOpportunities: Boolean,
});

Template.Student_Share_Info_Widget.onCreated(function studentShareInfoWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSharingSchema);
});

Template.Student_Share_Info_Widget.helpers({
  trueValueUsername() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareUsername;
    }
    return null;
  },
  falseValueUsername() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareUsername;
    }
    return null;
  },
  trueValuePicture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.sharePicture;
    }
    return null;
  },
  falseValuePicture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.sharePicture;
    }
    return null;
  },
  trueValueWebsite() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareWebsite;
    }
    return null;
  },
  falseValueWebsite() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareWebsite;
    }
    return null;
  },
  trueValueCareerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareCareerGoals;
    }
    return null;
  },
  falseValueCareerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareCareerGoals;
    }
    return null;
  },
  trueValueInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareInterests;
    }
    return null;
  },
  falseValueInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareInterests;
    }
    return null;
  },
  trueValueAcademicPlan() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareAcademicPlan;
    }
    return null;
  },
  falseValueAcademicPlan() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareAcademicPlan;
    }
    return null;
  },
  trueValueCourses() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareCourses;
    }
    return null;
  },
  falseValueCourses() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareCourses;
    }
    return null;
  },
  trueValueOpportunities() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.shareOpportunities;
    }
    return null;
  },
  falseValueOpportunities() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return !profile.shareOpportunities;
    }
    return null;
  },
});

Template.Student_Share_Info_Widget.events({
  'submit .shareInfo': function submitShareInfo(event, instance) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSharingSchema, event);
    // console.log('updateData from event = %o', updateData);
    instance.context.reset();
    updateSharingSchema.clean(updateData, { mutate: true });
    // console.log(collectionName, updateData);
    updateData.id = profile._id;
    updateData.shareUsername = updateData.shareUsername === 'true';
    updateData.sharePicture = updateData.sharePicture === 'true';
    updateData.shareWebsite = updateData.shareWebsite === 'true';
    updateData.shareCareerGoals = updateData.shareCareerGoals === 'true';
    updateData.shareInterests = updateData.shareInterests === 'true';
    updateData.shareAcademicPlan = updateData.shareAcademicPlan === 'true';
    updateData.shareCourses = updateData.shareCourses === 'true';
    updateData.shareOpportunities = updateData.shareOpportunities === 'true';
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Error during student profile sharing update', error);
      }
    });
  },
});
