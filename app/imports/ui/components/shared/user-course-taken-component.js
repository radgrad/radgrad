import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';

Template.User_Course_Taken_Component.helpers({
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  coursesTaken() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return CourseInstances.find({ studentID: userID, verified: true, note: /ICS/ }).fetch();
    }
    return null;
  },
});

Template.User_Course_Taken_Component.events({
  // add your events here
});

Template.User_Course_Taken_Component.onCreated(function userCourseTakenComponentOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Courses.getPublicationName());
});

Template.User_Course_Taken_Component.onRendered(function userCourseTakenComponentOnRendered() {
  // add your statement here
});

Template.User_Course_Taken_Component.onDestroyed(function userCourseTakenComponentOnDestroyed() {
  // add your statement here
});

