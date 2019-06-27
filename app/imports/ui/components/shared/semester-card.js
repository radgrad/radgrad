import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '../../../startup/client/router.js';
import {
  isInRole,
  opportunitySemesters,
} from '../../utilities/template-helpers';
import { CourseAndOpportunityEnrollments } from '../../../api/public-stats/CourseAndOpportunityEnrollmentCollection';

Template.Semester_Card.helpers({
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
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
  isInRole,
  isType(type, value) {
    return type === value;
  },
  isStudent() {
    const group = FlowRouter.current().route.group.name;
    return (group === 'student');
  },
  itemName(item) {
    if (this.type === 'courses') {
      return `${item.name} (${item.number})`;
    }
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
    return `${description}...`;
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
    const enrollment = CourseAndOpportunityEnrollments.findDoc({ itemID: course._id });
    // console.log(course.name, enrollment.itemCount);
    return enrollment.itemCount;
  },
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
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
  typeCourse() {
    return (this.type === 'courses');
  },
  typeOpportunity() {
    return (this.type === 'opportunities');
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Semester_Card.events({
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

Template.Semester_Card.onRendered(function semesterCardOnRendered() {
  this.$('.ui .image').popup();
});
