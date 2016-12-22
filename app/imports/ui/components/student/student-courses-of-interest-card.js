import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';


Template.Student_Courses_Of_Interest_Card.onCreated(function appBodyOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Courses_Of_Interest_Card.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  courses() {
    return Courses.find().fetch();
  },
  courseInterests(course) {
    return Interests.findNames(course.interestIDs);
  },
  courseSemesters(semesterID) {
    const sem = Semesters.findDoc(semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return `${oppTerm} ${oppYear}`;
  },
  courseShortDescription(descript) {
    let description = descript;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}...`;
    }
    return description;
  },
});

Template.Student_Courses_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event, instance) {
    event.preventDefault();
    const course = this.course;
    const name = course.name;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID)).username;
    const ci = {
      semester: semSlug,
      opportunity: courseSlug.name,
      verified: false,
      student: username,
    };
    CourseInstances.define(ci);
  },
});

Template.Student_Courses_Of_Interest_Card.onRendered(function studentCoursesOfInterestCardOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
