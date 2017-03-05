import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';


Template.Student_Of_Interest_Add.onCreated(function studentOfInterestCardOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(3));
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
});

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

Template.Student_Of_Interest_Add.helpers({
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
  replaceSemString(array) {
    const currentSem = currentSemester();
    const currentYear = currentSem.year;
    let fourRecentSem = _.filter(array, function isRecent(semesterYear) {
      return semesterYear.split(' ')[1] >= currentYear;
    });
    fourRecentSem = array.slice(0, 4);
    const semString = fourRecentSem.join(' - ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  typeCourse() {
    return (this.type === 'courses');
  },
  userSlug(studentID) {
    return Slugs.findDoc((Users.findDoc(studentID)).slugID).name;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
});

Template.Student_Of_Interest_Add.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const semester = event.target.text;
    const itemSlug = Slugs.findDoc({ _id: this.item.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    if (this.type === 'courses') {
      const ci = {
        semester: semSlug,
        course: itemSlug,
        verified: false,
        note: this.item.number,
        grade: 'B',
        student: username,
      };
      CourseInstances.define(ci);
    } else {
      const oi = {
        semester: semSlug,
        opportunity: itemSlug.name,
        verified: false,
        student: username,
      };
      OpportunityInstances.define(oi);
    }
  },
});

Template.Student_Of_Interest_Add.onRendered(function studentOfInterestAddOnRendered() {
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

