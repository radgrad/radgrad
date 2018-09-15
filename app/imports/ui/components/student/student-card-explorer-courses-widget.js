import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';

Template.Student_Card_Explorer_Courses_Widget.onCreated(function studentCardExplorerCoursesWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
});

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0) {
    const filtered = _.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    return filtered;
  }
  return [];
};

function matchingCourses() {
  if (getRouteUserName()) {
    const allCourses = availableCourses();
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCourses, interestIDs);
    return preferred.getOrderedChoices();
  }
  return [];
}

function hiddenCoursesHelper() {
  if (getRouteUserName()) {
    const courses = matchingCourses();
    let nonHiddenCourses;
    if (Template.instance().hidden.get()) {
      const profile = Users.getProfile(getRouteUserName());
      nonHiddenCourses = _.filter(courses, (course) => {
        if (_.includes(profile.hiddenCourseIDs, course._id)) {
          return false;
        }
        return true;
      });
    } else {
      nonHiddenCourses = courses;
    }
    return nonHiddenCourses;
  }
  return [];
}

Template.Student_Card_Explorer_Courses_Widget.helpers({
  courses() {
    const courses = matchingCourses();
    let visibleCourses;
    if (Template.instance().hidden.get()) {
      visibleCourses = hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  },
  hidden() {
    return Template.instance().hidden.get();
  },
  hiddenExists() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.hiddenCourseIDs.length !== 0;
    }
    return false;
  },
  itemCount() {
    return hiddenCoursesHelper().length;
  },
  typeCourse() {
    return true;
  },

});

Template.Student_Card_Explorer_Courses_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(true);
  },
});
