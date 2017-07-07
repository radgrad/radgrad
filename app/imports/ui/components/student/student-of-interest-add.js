import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

function currentSemester() {
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSem = Semesters.findDoc(currentSemesterID);
  return currentSem;
}

function opportunitySemesters(opp) {
  const semesters = opp.semesterIDs;
  const semesterNames = [];
  _.forEach(semesters, (sem) => {
    if (Semesters.findDoc(sem).semesterNumber >= currentSemester().semesterNumber) {
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
    return ret.slice(0, 8);
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
    return Users.getProfile(studentID).username;
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
      const definitionData = {
        semester: semSlug,
        course: itemSlug,
        verified: false,
        note: this.item.number,
        grade: 'B',
        student: username,
      };
      defineMethod.call({ collectionName: 'CourseInstanceCollection', definitionData }, (error, result) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        } else {
          const ci = CourseInstances.findDoc(result);
          // eslint-disable-next-line
          const message = `${getRouteUserName()} added ${ci.note} ${ci.getCourseDoc(ci._id).shortName} (${Semesters.toString(ci.semesterID)}) to their Degree Plan.`;
          appLog.info(message);
        }
      });
    } else {
      const definitionData = {
        semester: semSlug,
        opportunity: itemSlug.name,
        verified: false,
        student: username,
      };
      defineMethod.call({ collectionName: 'OpportunityInstanceCollection', definitionData }, (error, result) => {
        if (error) {
          console.log('Error defining CourseInstance', error);
        } else {
          const oi = OpportunityInstances.findDoc(result);
          // eslint-disable-next-line
          const message = `${getRouteUserName()} added ${oi.getOpportunityDoc(oi._id).name} (${Semesters.toString(oi.semesterID)}) to their Degree Plan.`;
          appLog.info(message);
        }
      });
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

