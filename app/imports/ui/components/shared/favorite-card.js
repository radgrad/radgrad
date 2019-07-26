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
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { makeCourseICE } from '../../../api/ice/IceProcessor';

Template.Favorite_Card.helpers({
  courseICE(item) {
    const studentID = getUserIdFromRoute();
    const courseID = item._id;
    const instances = CourseInstances.findNonRetired({ studentID, courseID });
    let ice = { i: 0, c: 0, e: 0 };
    _.forEach(instances, (instance) => {
      const instICE = makeCourseICE(Slugs.getNameFromID(item.slugID), instance.grade);
      if (instICE.c > ice.c) {
        ice = instICE;
      }
    });
    return ice;
  },
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
  futureItem(item) {
    if (this.type === 'opportunities') {
      return true;
    }
    const studentID = getUserIdFromRoute();
    const currentSemester = Semesters.getCurrentSemesterDoc();
    let instances;
    if (this.type === 'courses') {
      instances = CourseInstances.findNonRetired({ studentID, courseID: item._id });
    } else if (this.type === 'opportunities') {
      instances = OpportunityInstances.findNonRetired({ studentID, opportunityID: item._id });
    }
    if (instances.length === 0) {
      return true;
    }
    const instanceSemesters = _.map(instances, (i) => Semesters.findDoc(i.semesterID));
    return _.some(instanceSemesters, (sem) => sem.semesterNumber >= currentSemester.semesterNumber);
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
  inPlan(item) {
    const studentID = getUserIdFromRoute();
    let instances;
    if (this.type === 'courses') {
      const courseID = item._id;
      instances = CourseInstances.findNonRetired({ studentID, courseID });
    } else if (this.type === 'opportunities') {
      const opportunityID = item._id;
      instances = OpportunityInstances.findNonRetired({ studentID, opportunityID });
    }
    return instances.length > 0;
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
    const enrollment = StudentParticipation.findDoc({ itemID: course._id });
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
  planSemesters(item) {
    const studentID = getUserIdFromRoute();
    let instances;
    if (this.type === 'courses') {
      const courseID = item._id;
      instances = CourseInstances.findNonRetired({ studentID, courseID });
    } else if (this.type === 'opportunities') {
      const opportunityID = item._id;
      instances = OpportunityInstances.findNonRetired({ studentID, opportunityID });
    }
    const semesters = _.map(instances, (i) => Semesters.toString(i.semesterID, false));
    const semString = semesters.join(' - ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
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
  takenCourse(item) {
    const studentID = getUserIdFromRoute();
    const courseID = item._id;
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const instances = CourseInstances.findNonRetired({ studentID, courseID });
    return _.some(instances, (i) => Semesters.findDoc(i.semesterID).semesterNumber < currentSemester.semesterNumber);
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

Template.Favorite_Card.events({
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

Template.Favorite_Card.onRendered(function semesterCardOnRendered() {
  this.$('.ui .image').popup();
});
