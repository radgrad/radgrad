import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Interests } from '../../../api/interest/InterestCollection';
import { appLog } from '../../../api/log/AppLogCollection';

Template.Student_Explorer_CareerGoals_Widget.helpers({
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  fullName(user) {
    return Users.getFullName(user);
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestSlugName(interestSlugName) {
    const slugID = Interests.findDoc(interestSlugName).slugID;
    return Slugs.getNameFromID(slugID);
  },
  isLabel(label, value) {
    return label === value;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    const picture = Users.getProfile(user).picture;
    return picture || '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
  userStatus(careerGoal) {
    let ret = false;
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      ret = true;
    }
    return ret;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

Template.Student_Explorer_CareerGoals_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    const studentItems = profile.careerGoalIDs;
    try {
      studentItems.push(id);
      // TODO replace with method
      Users.setCareerGoalIds(profile.userID, studentItems);
      const goal = CareerGoals.findDoc(id);
      const message = `${getRouteUserName()} added career goal ${goal.name}`;
      appLog.info(message);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    let studentItems = profile.careerGoalIDs;
    try {
      studentItems = _.without(studentItems, id);
      // TODO replace with method.
      Users.setCareerGoalIds(profile.userID, studentItems);
      const goal = CareerGoals.findDoc(id);
      const message = `${getRouteUserName()} removed career goal ${goal.name}`;
      appLog.info(message);
    } catch (e) {
      // don't do anything.
    }
  },
});
