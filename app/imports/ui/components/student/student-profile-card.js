import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';
import { getGroupName } from '../shared/route-group-name';

Template.Student_Profile_Card.onCreated(function studentProfileCardOnCreated() {
  this.hidden = new ReactiveVar(true);
});

function interestedStudentsHelper(item, type) {
  const interested = [];
  let instances = StudentProfiles.find({}).fetch();
  if (type === 'careergoals') {
    instances = _.filter(instances, (profile) => _.includes(profile.careerGoalIDs, item._id));
  } else if (type === 'interests') {
    instances = _.filter(instances, (profile) => _.includes(profile.interestIDs, item._id));
  }
  // console.log(instances);
  _.forEach(instances, (p) => {
    if (!_.includes(interested, p.userID)) {
      interested.push(p.userID);
    }
  });
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  // console.log(interested);
  return interested;
}

Template.Student_Profile_Card.helpers({
  careerGoalsRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  hidden() {
    return Template.instance().hidden.get();
  },
  interestRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerInterestsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  interestedStudents(course) {
    return interestedStudentsHelper(course, this.type);
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
  studentFullName(studentID) {
    if (studentID === 'elispsis') {
      return '';
    }
    return Users.getFullName(studentID);
  },
  typeCareerGoals() {
    return (this.type === 'careergoals');
  },
  typeInterests() {
    return (this.type === 'interests');
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
});

Template.Student_Profile_Card.onRendered(function studentProfileCardOnRendered() {
  this.$('.ui .image').popup();
});
