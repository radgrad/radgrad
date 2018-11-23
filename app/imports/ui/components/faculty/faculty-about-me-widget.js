import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { openCloudinaryWidget } from '../form-fields/open-cloudinary-widget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

/* global alert */

Template.Faculty_About_Me_Widget.helpers({
  careerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return _.map(profile.careerGoalIDs, (id) => CareerGoals.findDoc(id));
    }
    return [];
  },
  careerGoalsRouteName() {
    return RouteNames.facultyExplorerCareerGoalsPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.facultyExplorerDegreesPageRouteName;
  },
  email() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.username;
    }
    return '';
  },
  firstCareerGoal() {
    let ret;
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      ret = Slugs.findDoc(careerGoals[0].slugID).name;
    }
    return ret;
  },
  firstDegree() {
    let ret;
    const degrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
    }
    return ret;
  },
  firstInterest() {
    let ret;
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  },
  getDictionary() {
    return Template.instance().state;
  },
  goalName(goal) {
    return goal.name;
  },
  interestName(interest) {
    return interest.name;
  },
  interests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return _.map(profile.interestIDs, (id) => Interests.findDoc(id));
    }
    return [];
  },
  interestsRouteName() {
    return RouteNames.facultyExplorerInterestsPageRouteName;
  },
  name() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return `${profile.firstName} ${profile.lastName}`;
    }
    return '';
  },
  picture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.picture;
    }
    return '';
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.picture;
    }
    return '';
  },
  website() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.website;
    }
    return '';
  },
});

Template.Faculty_About_Me_Widget.events({
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const collectionName = FacultyProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    updateData.website = event.target.website.value || ' ';
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error during Faculty profile website update', error);
      } else {
        alert('Website update successful.');
      }
    });
  },

  'submit .picture': function submitPicture(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const collectionName = FacultyProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    updateData.picture = event.target.picture.value;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error during Faculty profile picture update', error);
      } else {
        alert('Picture update successful.');
      }
    });
  },

  'click #image-upload-widget': function clickUpload(event) {
    event.preventDefault();
    openCloudinaryWidget('picture');
  },
});
