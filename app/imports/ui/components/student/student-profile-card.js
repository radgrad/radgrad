import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Student_Profile_Card.onCreated(function studentProfileCardOnCreated() {
  this.hidden = new ReactiveVar(true);
});

function interestedStudentsHelper(item, type) {
  const interested = [];
  let instances;
  if (type === 'careergoals') {
    instances = StudentProfiles.find({}).fetch();
    instances = _.filter(instances, (profile) => _.includes(profile.careerGoalIDs, item._id));
  }
  // console.log(instances);
  _.forEach(instances, (p) => {
    if (!_.includes(interested, p.userID)) {
      interested.push(p.userID);
    }
  });
  // console.log(interested);
  return interested;
}

Template.Student_Profile_Card.helpers({
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  hidden() {
    return Template.instance().hidden.get();
  },
  itemName(item) {
    return item.name;
  },
  itemShortDescription(item) {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  },
  interestedStudents(course) {
    return interestedStudentsHelper(course, this.type);
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  numberStudents(course) {
    return interestedStudentsHelper(course, this.type).length;
  },
  replaceSemString(array) {
    // console.log('array', array);
    const currentSem = Semesters.getCurrentSemesterDoc();
    const currentYear = currentSem.year;
    let fourRecentSem = _.filter(array, function isRecent(semesterYear) {
      return semesterYear.split(' ')[1] >= currentYear;
    });
    fourRecentSem = array.slice(0, 4);
    const semString = fourRecentSem.join(' - ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  studentPicture(studentID) {
    if (studentID === 'elipsis') {
      return '/images/elipsis.png';
    }
    return Users.getProfile(studentID).picture;
  },
  typeCareerGoals() {
    return (this.type === 'careergoals');
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
});

Template.Student_Profile_Card.events({
  // add your events here
});

Template.Student_Profile_Card.onRendered(function studentProfileCardOnRendered() {
  // add your statement here
});

Template.Student_Profile_Card.onDestroyed(function studentProfileCardOnDestroyed() {
  // add your statement here
});

