import { Template } from 'meteor/templating';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

Template.Student_Profile_Add.onCreated(function studentProfileAddOnCreated() {
  // add your statement here
});

Template.Student_Profile_Add.helpers({
  // add your helpers here
});

Template.Student_Profile_Add.events({
  'click .jsAddToProfile': function clickAddToProfile(event, instance) {
    event.preventDefault();
    if (instance.data.type === 'careergoals') {
      if (getRouteUserName()) {
        const profile = Users.getProfile(getRouteUserName());
        const updateData = {};
        updateData.id = profile._id;
        updateData.careerGoals = profile.careerGoalIDs;
        updateData.careerGoals.push(instance.data.item._id);
        const collectionName = StudentProfiles.getCollectionName();
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            console.log('Error updating user ', error);
          }
        });
      }
    }
  },
});

Template.Student_Profile_Add.onRendered(function studentProfileAddOnRendered() {
  // add your statement here
});

Template.Student_Profile_Add.onDestroyed(function studentProfileAddOnDestroyed() {
  // add your statement here
});

