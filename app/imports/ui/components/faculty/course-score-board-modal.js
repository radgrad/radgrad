import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';

Template.Course_Score_Board_Modal.helpers({
  courseCount() {
    const course = Template.instance().data.course;
    const semester = Template.instance().data.semester;
    // console.log(Template.instance().data, course, semester);
    const count = CourseInstances.find({ courseID: course._id, semesterID: semester._id }).count();
    return count;
  },
  students() {
    // console.log('students');
    const course = Template.instance().data.course;
    const semester = Template.instance().data.semester;
    // console.log(course, semester);
    const cis = CourseInstances.find({ courseID: course._id, semesterID: semester._id }).fetch();
    const students = [];
    _.forEach(cis, (ci) => {
      students.push(Users.getProfile(ci.studentID));
    });
    return students;
  },
  fullName(student) {
    return Users.getFullName(student.username);
  },
  userSlug(feed) {
    return Users.getProfile(feed.userIDs[0]).username;
  },
  userRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
});

Template.Course_Score_Board_Modal.events({
  'click .modal': function clickOpenModal(event, instance) {
    event.preventDefault();
    $(`#${instance.data.course._id}${instance.data.semester._id}.ui.small.modal`).modal('show');
  },
});

Template.Course_Score_Board_Modal.onRendered(function courseScoreBoardModalOnRendered() {
  // add your statement here
});

Template.Course_Score_Board_Modal.onDestroyed(function courseScoreBoardModalOnDestroyed() {
  // add your statement here
});

