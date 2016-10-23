import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';

Template.Academic_Year.helpers({
  fallSemester(year) {
    const sem = Semesters.find({ term: Semesters.FALL, year }).fetch();
    return Semesters.toString(sem[0]._id);
  },
  springSemester(year) {
    const sem = Semesters.find({ term: Semesters.SPRING, year }).fetch();
    return Semesters.toString(sem[0]._id);
  },
  summerSemester(year) {
    const sem = Semesters.find({ term: Semesters.SUMMER, year }).fetch();
    return Semesters.toString(sem[0]._id);
  },
  fallSemesterIceI(year) {
    return { i: 20, c: 18, e: 20 }.i;
  },
  fallSemesterIceC(year) {
    return { i: 20, c: 18, e: 20 }.c;
  },
  fallSemesterIceE(year) {
    return { i: 20, c: 18, e: 20 }.e;
  },
  springSemesterIceI(year) {
    return { i: 0, c: 9, e: 50 }.i;
  },
  springSemesterIceC(year) {
    return { i: 0, c: 9, e: 50 }.c;
  },
  springSemesterIceE(year) {
    return { i: 0, c: 9, e: 50 }.e;
  },
  summerSemesterIceI(year) {
    return { i: 25, c: 18, e: 0 }.i;
  },
  summerSemesterIceC(year) {
    return { i: 25, c: 18, e: 0 }.c;
  },
  summerSemesterIceE(year) {
    return { i: 25, c: 18, e: 0 }.e;
  },
});

Template.Academic_Year.events({
  // add your events here
});

Template.Academic_Year.onCreated(function () {
  // add your statement here
});

Template.Academic_Year.onRendered(function () {
  // add your statement here
});

Template.Academic_Year.onDestroyed(function () {
  // add your statement here
});

