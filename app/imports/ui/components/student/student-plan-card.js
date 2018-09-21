import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

function interestedStudentsHelper(item, type) {
  const interested = [];
  let instances = StudentProfiles.find({})
    .fetch();
  if (type === 'plans') {
    instances = _.filter(instances, (profile) => profile.academicPlanID === item._id);
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

Template.Student_Plan_Card.helpers({
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
  plansRouteName() {
    return RouteNames.studentExplorerPlansPageRouteName;
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
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
});

Template.Student_Plan_Card.events({
  // add your events here
});

Template.Student_Plan_Card.onRendered(function studentPlanCardOnRendered() {
  this.$('.ui .image').popup();
});

Template.Student_Plan_Card.onDestroyed(function studentPlanCardOnDestroyed() {
  // add your statement here
});

