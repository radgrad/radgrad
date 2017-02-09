import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { Interests } from '../../../api/interest/InterestCollection';


Template.Student_Explorer_CareerGoals_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  userStatus(careerGoal) {
    let ret = false;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      ret = true;
    }
    return ret;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestName(interestSlugName) {
    return Interests.findDoc(interestSlugName).name;
  },
  interestSlugName(interestSlugName) {
    const slugID = Interests.findDoc(interestSlugName).slugID;
    return Slugs.getNameFromID(slugID);
  },
  replaceSemString(array) {
    const semString = array.join(', ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userUsername(user) {
    return Users.findDoc(user).username;
  },
});

Template.Student_Explorer_CareerGoals_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    const studentItems = student.careerGoalIDs;
    try {
      studentItems.push(id);
      Users.setCareerGoalIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    let studentItems = student.careerGoalIDs;
    try {
      studentItems = _.without(studentItems, id);
      Users.setCareerGoalIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
});

Template.Student_Explorer_CareerGoals_Widget.onCreated(function studentExplorerCareerGoalsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});
