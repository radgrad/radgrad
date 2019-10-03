import { Template } from 'meteor/templating';

import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { getGroupName } from './route-group-name';

Template.Profile_Add.helpers({
  isPlan(type) {
    return (type === 'plans');
  },
});

Template.Profile_Add.events({
  'click .jsAddToProfile': function clickAddToProfile(event, instance) {
    event.preventDefault();
    if (getRouteUserName()) {
      const updateData = {};
      const profile = Users.getProfile(getRouteUserName());
      updateData.id = profile._id;
      const group = getGroupName();
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
      const definitionData = {};
      definitionData.student = getRouteUserName();
      if (instance.data.type === 'careergoals') {
        collectionName = FavoriteCareerGoals.getCollectionName();
        definitionData.careerGoal = Slugs.getNameFromID(instance.data.item.slugID);
      } else if (instance.data.type === 'interests') {
        collectionName = FavoriteInterests.getCollectionName();
        definitionData.interest = Slugs.getNameFromID(instance.data.item.slugID);
      } else if (instance.data.type === 'plans') {
        collectionName = FavoriteAcademicPlans.getCollectionName();
        definitionData.academicPlan = Slugs.getNameFromID(instance.data.item.slugID);
      }
      defineMethod.call({ collectionName, definitionData }, (error) => {
        if (error) {
          console.error('Error defining favorites', error);
        }
      });
    }
  },
});

Template.Profile_Add.onRendered(function profileAddOnRendered() {
  const template = this;
  template.$('.chooseSemester')
    .popup({
      on: 'click',
    });
  template.$('.chooseYear')
    .popup({
      on: 'click',
    });
});
