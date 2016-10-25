import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';

Template.Academic_Year.helpers({
  fallYear() {
    return Template.instance().state.get('fallYear');
  },
  springYear() {
    return Template.instance().state.get('springYear');
  },
  icsCoursesFallSemester() {
    const sem = Semesters.find({ term: Semesters.FALL, year: Template.instance().state.get('fallYear') }).fetch();
    const ret = [];
    if (sem.length > 0) {
      const courses = CourseInstances.find({ semesterID: sem[0]._id,
        studentID: Template.instance().state.get('studentID') }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c.note);
        }
      });
    }
    return ret;
  },
  nonIcsCoursesFallSemester() {
    return [
      'ANTH 152',
      'PHIL 213',
      'ENG 273',
    ];
  },
  jobFallSemester() {
    return 'Job(10)';
  },
  oppFallSemester() {
    return [
      'Club',
      'Event',
      'Event',
    ];
  },
  icsCoursesSpringSemester() {
    const sem = Semesters.find({ term: Semesters.SPRING, year: Template.instance().state.get('springYear') }).fetch();
    const ret = [];
    if (sem.length > 0) {
      const courses = CourseInstances.find({ semesterID: sem[0]._id,
        studentID: Template.instance().state.get('studentID') }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c.note);
        }
      });
    }
    return ret;
  },
  nonIcsCoursesSpringSemester() {
    return [
      'ANTH 252',
      'REL 250',
      'LING 150',
    ];
  },
  jobSpringSemester() {
    return 'Job(25)';
  },
  oppSpringSemester() {
    return [
      'Research',
      'Award',
    ];
  },
  icsCoursesSummerSemester() {
    const sem = Semesters.find({ term: Semesters.SUMMER, year: Template.instance().state.get('springYear') }).fetch();
    const ret = [];
    if (sem.length > 0) {
      const courses = CourseInstances.find({ semesterID: sem[0]._id,
        studentID: Template.instance().state.get('studentID') }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c.note);
        }
      });
    }
    return ret;
  },
  nonIcsCoursesSummerSemester() {
    return [
    ];
  },
  jobSummerSemester() {
    return 'Job(0)';
  },
  oppSummerSemester() {
    return [
      'Internship',
    ];
  },
  fallSemester(year) {
    if (year) {
      const sem = Semesters.find({ term: Semesters.FALL, year }).fetch();
      if (sem.length === 0) {
        const semId = Semesters.define({ term: Semesters.FALL, year });
        sem.push(Semesters.findDoc(semId));
      }
      return sem[0] && Semesters.toString(sem[0]._id);
    }
    return year;
  },
  springSemester(year) {
    if (year) {
      const sem = Semesters.find({ term: Semesters.SPRING, year }).fetch();
      if (sem.length === 0) {
        const semId = Semesters.define({ term: Semesters.SPRING, year });
        sem.push(Semesters.findDoc(semId));
      }
      return sem[0] && Semesters.toString(sem[0]._id);
    }
    return year;
  },
  summerSemester(year) {
    if (year) {
      const sem = Semesters.find({ term: Semesters.SUMMER, year }).fetch();
      if (sem.length === 0) {
        const semId = Semesters.define({ term: Semesters.SUMMER, year });
        sem.push(Semesters.findDoc(semId));
      }
      return sem[0] && Semesters.toString(sem[0]._id);
    }
    return year;
  },
  fallSemesterICE() {
    return { i: 20, c: 18, e: 20 };
  },
  springSemesterICE() {
    return { i: 0, c: 9, e: 50 };
  },
  summerSemesterICE() {
    return { i: 25, c: 18, e: 0 };
  },
});

Template.Academic_Year.events({
  'click #prevYear'(event, instance) {
    event.preventDefault();
    const prevFall = instance.state.get('fallYear') - 1;
    instance.state.set('fallYear', prevFall);
    instance.state.set('springYear', prevFall + 1);
    this.springYear = prevFall + 1;
    this.fallYear = prevFall;
  },
  'click #nextYear'(event, instance) {
    event.preventDefault();
    const nextFall = instance.state.get('fallYear') + 1;
    instance.state.set('fallYear', nextFall);
    instance.state.set('springYear', nextFall + 1);
    this.springYear = nextFall + 1;
    this.fallYear = nextFall;
  },
});

Template.Academic_Year.onCreated(function academicYearCreated() {
  this.state = new ReactiveDict();
});

Template.Academic_Year.onRendered(function () {
  this.state.set('fallYear', this.data.fallYear);
  this.state.set('springYear', this.data.springYear);
  this.state.set('studentID', this.data.studentID);
});

Template.Academic_Year.onDestroyed(function () {
  // add your statement here
});

