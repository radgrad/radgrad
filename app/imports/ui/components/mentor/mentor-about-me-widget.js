import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '/imports/startup/client/router.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

const edit = false;

Template.Mentor_About_Me_Widget.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(edit, false);
});

Template.Mentor_About_Me_Widget.helpers({
  career() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ mentorID: getUserIdFromRoute() });
      return profile.career;
    }
    return '';
  },
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  careerGoalsRouteName() {
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  company() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ mentorID: getUserIdFromRoute() });
      return profile.company;
    }
    return '';
  },
  degreesRouteName() {
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  desiredDegree() {
    let ret = '';
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      if (user.desiredDegreeID) {
        ret = DesiredDegrees.findDoc(user.desiredDegreeID).name;
      }
    }
    return ret;
  },
  edit() {
    return Template.instance().messageFlags.get(edit);
  },
  email() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return Users.getEmail(user._id);
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
    const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
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
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  interestsRouteName() {
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  linkedin() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ mentorID: getUserIdFromRoute() });
      return profile.linkedin;
    }
    return '';
  },
  location() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ mentorID: getUserIdFromRoute() });
      return profile.location;
    }
    return '';
  },
  motivation() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ mentorID: getUserIdFromRoute() });
      return profile.motivation;
    }
    return '';
  },
  name() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
    }
    return '';
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.picture;
    }
    return '';
  },
  website() {
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      return user.website;
    }
    return '';
  },
});

Template.Mentor_About_Me_Widget.events({
  'submit .website': function submitWebsite(event) {
    event.preventDefault();
    const user = Users.findDoc({ username: getRouteUserName() });
    const choice = event.target.website.value;
    Users.setWebsite(user._id, choice);
  },
  'submit .picture': function submitPicture(event) {
    event.preventDefault();
    const user = Users.findDoc({ username: getRouteUserName() });
    const choice = event.target.picture.value;
    Users.setPicture(user._id, choice);
  },
  'submit .company': function submitCompany(event) {
    event.preventDefault();
    const choice = event.target.company.value;
    MentorProfiles.setCompany(getUserIdFromRoute(), choice);
  },
  'submit .career': function submitCareer(event) {
    event.preventDefault();
    const choice = event.target.career.value;
    MentorProfiles.setCareer(getUserIdFromRoute(), choice);
  },
  'submit .location': function submitLocation(event) {
    event.preventDefault();
    const choice = event.target.location.value;
    MentorProfiles.setLocation(getUserIdFromRoute(), choice);
  },
  'submit .linkedin': function submitLinkedIn(event) {
    event.preventDefault();
    const choice = event.target.linkedin.value;
    MentorProfiles.setLinkedIn(getUserIdFromRoute(), choice);
  },
  'submit .motivation': function submitMotivation(event) {
    event.preventDefault();
    const choice = event.target.motivation.value;
    MentorProfiles.setMotivation(getUserIdFromRoute(), choice);
  },
  'click .editProfile': function submitMotivation(event, instance) {
    instance.messageFlags.set(edit, true);
  },
  'click .doneEdit': function submitMotivation(event, instance) {
    instance.messageFlags.set(edit, false);
  },
});
