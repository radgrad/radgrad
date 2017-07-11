import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '/imports/startup/client/router.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

function interestedStudentsHelper(item, type) {
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
  _.forEach(instances, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

function currentSemester() {
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSem = Semesters.findDoc(currentSemesterID);
  return currentSem;
}

function opportunitySemesters(opp) {
  const semesterIDs = opp.semesterIDs;
  const upcomingSemesters = _.filter(semesterIDs, semesterID => Semesters.isUpcomingSemester(semesterID));
  return _.map(upcomingSemesters, semesterID => Semesters.toString(semesterID));
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
    const currentSem = currentSemester();
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
    console.log('array', array);
    const currentSem = currentSemester();
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
  typeCourse() {
    return (this.type === 'courses');
  },
  userSlug(studentID) {
    return Users.getProfile(studentID).username;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
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
    if (this.type === 'courses') {
      const studentItems = profile.hiddenCourseIDs;
      try {
        studentItems.push(id);
        // TODO Replace with method.
        Users.setHiddenCourseIds(profile.userID, studentItems);
      } catch (e) {
        // TODO eliminate empty catch.
      }
    } else {
      const studentItems = profile.hiddenOpportunityIDs;
      try {
        studentItems.push(id);
        // TODO Replace with method.
        Users.setHiddenOpportunityIds(profile.userID, studentItems);
      } catch (e) {
        // TODO eliminate empty catch.
      }
    }
  },
  'click .unhide': function clickItemHide(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = this.item._id;
    if (this.type === 'courses') {
      let studentItems = profile.hiddenCourseIDs;
      try {
        studentItems = _.without(studentItems, id);
        Users.setHiddenCourseIds(profile.userID, studentItems);
      } catch (e) {
        // TODO eliminate empty catch
      }
    } else {
      let studentItems = profile.hiddenOpportunityIDs;
      try {
        studentItems = _.without(studentItems, id);
        Users.setHiddenOpportunityIds(profile.userID, studentItems);
      } catch (e) {
        // TODO eliminate empty catch.
      }
    }
  },
});
