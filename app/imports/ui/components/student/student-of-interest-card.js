import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '../../../startup/client/router.js';
import {
  opportunitySemesters,
} from '../../utilities/template-helpers';

function interestedStudentsHelper(item, type) {
  // console.log('interestedStudents(%o, %o)', item, type);
  const interested = [];
  let instances;
  if (type === 'courses') {
    instances = CourseInstances.find({
      courseID: item._id,
    }).fetch();
  } else {
    instances = OpportunityInstances.find({
      opportunityID: item._id,
    }).fetch();
  }
  // console.log(instances.length);
  _.forEach(instances, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

Template.Student_Of_Interest_Card.helpers({
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  hidden() {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (this.type === 'courses') {
      if (_.includes(profile.hiddenCourseIDs, this.item._id)) {
        ret = 'grey';
      }
    } else
      if (_.includes(profile.hiddenOpportunityIDs, this.item._id)) {
        ret = 'grey';
      }
    return ret;
  },
  interestedStudents(course) {
    return interestedStudentsHelper(course, this.type);
  },
  itemName(item) {
    return item.name;
  },
  itemSemesters() {
    let ret = [];
    if (this.type === 'courses') {
      // do nothing
    } else {
      ret = opportunitySemesters(this.item);
    }
    return ret;
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
  nextYears(amount) {
    const nextYears = [];
    const currentSem = Semesters.getCurrentSemesterDoc();
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  numberStudents(course) {
    return interestedStudentsHelper(course, this.type).length;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
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
    // console.log(Users.getFullName(studentID));
    return Users.getFullName(studentID);
  },
  typeCourse() {
    return (this.type === 'courses');
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
  usersRouteName() {
    return RouteNames.studentCardExplorerUsersPageRouteName;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Student_Of_Interest_Card.events({
  'click .hide': function clickItemHide(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = this.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    if (this.type === 'courses') {
      const studentItems = profile.hiddenCourseIDs;
      studentItems.push(id);
      updateData.hiddenCourses = studentItems;
    } else {
      const studentItems = profile.hiddenOpportunityIDs;
      studentItems.push(id);
      updateData.hiddenOpportunities = studentItems;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error hiding course/opportunity', error);
      }
    });
  },
  'click .unhide': function clickItemHide(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = this.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    if (this.type === 'courses') {
      let studentItems = profile.hiddenCourseIDs;
      studentItems = _.without(studentItems, id);
      updateData.hiddenCourses = studentItems;
    } else {
      let studentItems = profile.hiddenOpportunityIDs;
      studentItems = _.without(studentItems, id);
      updateData.hiddenOpportunities = studentItems;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error unhiding course/opportunity', error);
      }
    });
  },
});

Template.Student_Of_Interest_Card.onRendered(function interestCardOnRendered() {
  this.$('.ui.image').popup();
});
