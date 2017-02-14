import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Of_Interest_Card.onCreated(function studentOfInterestCardOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(3));
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
});

function interestedStudentsHelper(item) {
  const interested = [];
  let count = 0;
  let instances;
  if (this.type === 'courses') {
    instances = CourseInstances.find({
      courseID: item._id,
    }).fetch();
  } else {
    instances = OpportunityInstances.find({
      opportunityID: item._id,
    }).fetch();
  }
  _.map(instances, (c) => {
    if (count < 17) {
      if (!_.includes(interested, c.studentID)) {
        interested.push(c.studentID);
        count += 1;
      }
    } else
      if (count === 17) {
        interested.push('elipsis');
      }
  });
  return interested;
}

function matchingInterestsHelper(item) {
  const matchingInterests = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  const itemInterests = [];
  _.map(item.interestIDs, (id) => {
    itemInterests.push(Interests.findDoc(id));
  });
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(itemInterests, (itemInterest) => {
    _.map(userInterests, (userInterest) => {
      if (_.isEqual(itemInterest, userInterest)) {
        matchingInterests.push(userInterest);
      }
    });
  });
  return matchingInterests;
}

function currentSemester() {
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSem = Semesters.findDoc(currentSemesterID);
  return currentSem;
}

function opportunitySemesters(opp) {
  const semesters = opp.semesterIDs;
  const semesterNames = [];
  _.map(semesters, (sem) => {
    if (Semesters.findDoc(sem).sortBy >= currentSemester().sortBy) {
      semesterNames.push(Semesters.toString(sem));
    }
  });
  return semesterNames;
}

Template.Student_Of_Interest_Card.helpers({
  courses() {
    return Courses.find().fetch();
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
  itemInterests(item) {
    return Interests.findNames(item.interestIDs);
  },
  itemName(item) {
    return item.name;
  },
  itemShortDescription(item) {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
    }
    return description;
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
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  interestSlug(interest) {
    return Slugs.findDoc(interest.slugID).name;
  },
  userSlug(studentID) {
    return Slugs.findDoc((Users.findDoc(studentID)).slugID).name;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  matchingInterests(course) {
    return matchingInterestsHelper(course);
  },
  otherInterests(course) {
    const matchingInterests = matchingInterestsHelper(course);
    const courseInterests = [];
    _.map(course.interestIDs, (id) => {
      courseInterests.push(Interests.findDoc(id));
    });
    const filtered = _.filter(courseInterests, function (courseInterest) {
      let ret = true;
      _.map(matchingInterests, (matchingInterest) => {
        if (_.isEqual(courseInterest, matchingInterest)) {
          ret = false;
        }
      });
      return ret;
    });
    return filtered;
  },
  hidden() {
    let ret = '';
    const student = Users.findDoc({ username: getRouteUserName() });
    if (this.type === 'courses') {
      if (_.includes(student.hiddenCourseIDs, this.item._id)) {
        ret = 'grey';
      } else {
        // buttons remain green
      }
    } else
      if (_.includes(student.hiddenOpportunityIDs, this.item._id)) {
        ret = 'grey';
      } else {
        // buttons remain green
      }
    return ret;
  },
  interestName(interest) {
    return interest.name;
  },
  interestedStudents(course) {
    return interestedStudentsHelper(course);
  },
  numberStudents(course) {
    return interestedStudentsHelper(course).length;
  },
  studentPicture(studentID) {
    if (studentID === 'elipsis') {
      return '/images/elipsis.png';
    }
    const student = Users.findDoc(studentID);
    return student.picture;
  },
  typeCourse() {
    return (this.type === 'courses');
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
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
});

Template.Student_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    if (this.type === 'courses') {
      const course = this.course;
      const semester = event.target.text;
      const courseSlug = Slugs.findDoc({ _id: course.slugID });
      const semSplit = semester.split(' ');
      const semSlug = `${semSplit[0]}-${semSplit[1]}`;
      const username = getRouteUserName();
      const ci = {
        semester: semSlug,
        course: courseSlug,
        verified: false,
        note: course.number,
        grade: 'B',
        student: username,
      };
      CourseInstances.define(ci);
    } else {
      const opportunity = this.opportunity;
      const semester = event.target.text;
      const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
      const semSplit = semester.split(' ');
      const semSlug = `${semSplit[0]}-${semSplit[1]}`;
      const username = getRouteUserName();
      const oi = {
        semester: semSlug,
        opportunity: oppSlug.name,
        verified: false,
        student: username,
      };
      OpportunityInstances.define(oi);
    }
  },
  'click .hide': function clickItemHide(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = this.item._id;
    if (this.type === 'courses') {
      const studentItems = student.hiddenCourseIDs;
      try {
        studentItems.push(id);
        Users.setHiddenCourseIds(student._id, studentItems);
      } catch (e) {
        // don't do anything.
      }
    } else {
      const studentItems = student.hiddenOpportunityIDs;
      try {
        studentItems.push(id);
        Users.setHiddenOpportunityIds(student._id, studentItems);
      } catch (e) {
        // don't do anything.
      }
    }
  },
  'click .unhide': function clickItemHide(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = this.item._id;
    if (this.type === 'courses') {
      let studentItems = student.hiddenCourseIDs;
      try {
        studentItems = _.without(studentItems, id);
        Users.setHiddenCourseIds(student._id, studentItems);
      } catch (e) {
        // don't do anything.
      }
    } else {
      let studentItems = student.hiddenOpportunityIDs;
      try {
        studentItems = _.without(studentItems, id);
        Users.setHiddenOpportunityIds(student._id, studentItems);
      } catch (e) {
        // don't do anything.
      }
    }
  },
});

Template.Student_Of_Interest_Card.onRendered(function studentOfInterestCardOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
  template.$('.chooseYear')
      .popup({
        on: 'click',
      });
});

