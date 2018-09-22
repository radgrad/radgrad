import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';

Template.Student_Profile_Add.helpers({
  isPlan(type) {
    return (type === 'plans');
  },
});

Template.Student_Profile_Add.events({
  'click .jsAddToProfile': function clickAddToProfile(event, instance) {
    event.preventDefault();
    if (getRouteUserName()) {
      const updateData = {};
      const profile = Users.getProfile(getRouteUserName());
      updateData.id = profile._id;
      const group = FlowRouter.current().route.group.name;
      let collectionName = '';
      if (group === 'student') {
        collectionName = StudentProfiles.getCollectionName();
      } else if (group === 'faculty') {
        collectionName = FacultyProfiles.getCollectionName();
      } else {
        collectionName = MentorProfiles.getCollectionName();
      }
      if (instance.data.type === 'careergoals') {
        updateData.careerGoals = profile.careerGoalIDs;
        updateData.careerGoals.push(instance.data.item._id);
      } else if (instance.data.type === 'interests') {
        updateData.interests = profile.interestIDs;
        updateData.interests.push(instance.data.item._id);
      } else if (instance.data.type === 'plans') {
        updateData.academicPlan = instance.data.item._id;
      }
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.log('Error updating user ', error);
        }
      });
    }
  },
});
