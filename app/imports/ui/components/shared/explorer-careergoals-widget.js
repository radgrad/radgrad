import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { getRouteUserName } from './route-user-name';
import { Interests } from '../../../api/interest/InterestCollection';
import { isLabel } from '../../utilities/template-helpers';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { getGroupName } from './route-group-name';

Template.Explorer_CareerGoals_Widget.helpers({
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  fullName(user) {
    return Users.getFullName(user);
  },
  hasTeaser(item) {
    const teaser = Teasers.find({ targetSlugID: item.slugID }).fetch();
    return teaser.length > 0;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestSlugName(interestSlugName) {
    const slugID = Interests.findDoc(interestSlugName).slugID;
    return Slugs.getNameFromID(slugID);
  },
  isLabel,
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    const picture = Users.getProfile(user).picture;
    return picture || defaultProfilePicture;
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userStatus(careerGoal) {
    let ret = false;
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        ret = true;
      }
    }
    return ret;
  },
  userUsername(user) {
    if (user) {
      return Users.getProfile(user).username;
    }
    return '';
  },
});

Template.Explorer_CareerGoals_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    const studentItems = profile.careerGoalIDs;
    let collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData = {};
    updateData.id = profile._id;
    studentItems.push(id);
    updateData.careerGoals = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      }
    });
    collectionName = FavoriteCareerGoals.getCollectionName();
    const definitionData = {};
    definitionData.student = getRouteUserName();
    const doc = CareerGoals.findDoc(id);
    definitionData.careerGoal = Slugs.getNameFromID(doc.slugID);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define favorite', error);
      }
    });
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    let studentItems = profile.careerGoalIDs;
    let collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData = {};
    updateData.id = profile._id;
    studentItems = _.without(studentItems, id);
    updateData.careerGoals = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      }
    });
    collectionName = FavoriteCareerGoals.getCollectionName();
    const favorite = FavoriteCareerGoals.findDoc({ careerGoalID: id });
    const instance = favorite._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error('Failed to remove favorite', error);
      }
    });
  },
});
