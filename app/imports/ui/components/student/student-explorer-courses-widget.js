import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Courses_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userStatus(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = true;
    }
    return ret;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSem = Semesters.findDoc(currentSemesterID);
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  notEmpty(list) {
    let ret = false;
    if (list[0].length + list[1].length + list[2].length > 0) {
      ret = true;
    }
    return ret;
  },
  review() {
    let review = '';
    review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: this.item._id,
    }).fetch();
    return review[0];
  },
  reviews() {
    let ret = false;
    let reviews = '';
    reviews = Reviews.find({
      revieweeID: this.item._id,
    }).fetch();
    if (reviews.length > 0) {
      ret = true;
    }
    return ret;
  },
  getTableTitle(tableIndex) {
    switch (tableIndex) {
      case 0:
        return '<h4><i class="green checkmark icon"></i>Completed</h4>';
      case 1:
        return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        return '<h4><i class="red warning circle icon"></i>Not in Plan';
      default:
        return 'ERROR: More than one table.';
    }
  },
  tableStyle(table) {
    let tableColor;
    let tableIcon;
    let tableTitle;
    if (table[0].status === 'Completed') {
      tableColor = 'green';
      tableIcon = 'icon checkmark';
      tableTitle = 'Completed';
    } else if (table[0].status === 'Not in plan') {
      tableColor = 'red';
      tableIcon = 'warning circle icon';
      tableTitle = 'Not in Plan';
    } else if (table[0].status === 'In plan, but not yet complete') {
      tableColor = 'yellow';
      tableIcon = 'warning sign icon';
      tableTitle = 'In Plan (Not Yet Completed)';
    }
    return { color: tableColor, icon: tableIcon, title: tableTitle };
  },
});

Template.Student_Explorer_Courses_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
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
  },
});

Template.Student_Explorer_Courses_Widget.onCreated(function studentExplorerCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
});

Template.Student_Explorer_Courses_Widget.onRendered(function studentExplorerCoursesWidgetOnRendered() {

});

