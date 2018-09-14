import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';


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
    const matching = [];
    const profile = Users.getProfile(getRouteUserName());
    const userInterests = [];
    let courseInterests = [];
    _.forEach(Users.getInterestIDs(profile.userID), (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.forEach(allCourses, (course) => {
      courseInterests = [];
      _.forEach(course.interestIDs, (id) => {
        courseInterests.push(Interests.findDoc(id));
        _.forEach(courseInterests, (courseInterest) => {
          _.forEach(userInterests, (userInterest) => {
            if (_.isEqual(courseInterest, userInterest)) {
              if (!_.includes(matching, course)) {
                matching.push(course);
              }
            }
          });
        });
      });
    });
    // Only display up to the first six matches.
    return matching;
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


Template.Student_Card_Explorer_Courses.helpers({
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
});

Template.Student_Card_Explorer_Courses.events({
  // add your events here
});

Template.Student_Card_Explorer_Courses.onRendered(function studentCardExplorerCoursesOnRendered() {
  // add your statement here
});

Template.Student_Card_Explorer_Courses.onDestroyed(function studentCardExplorerCoursesOnDestroyed() {
  // add your statement here
});

