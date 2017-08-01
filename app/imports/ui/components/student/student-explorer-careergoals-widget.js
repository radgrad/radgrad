import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Interests } from '../../../api/interest/InterestCollection';
import { appLog } from '../../../api/log/AppLogCollection';
import { isLabel } from '../../utilities/template-helpers';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

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
  isLabel,
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
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData = {};
    updateData.id = profile._id;
    studentItems.push(id);
    updateData.careerGoals = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      } else {
        const goal = CareerGoals.findDoc(id);
        const message = `${getRouteUserName()} added career goal ${goal.name}`;
        appLog.info(message);
      }
    });
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    let studentItems = profile.careerGoalIDs;
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData = {};
    updateData.id = profile._id;
    studentItems = _.without(studentItems, id);
    updateData.careerGoals = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      } else {
        const goal = CareerGoals.findDoc(id);
        const message = `${getRouteUserName()} removed career goal ${goal.name}`;
        appLog.info(message);
      }
    });
  },
});
