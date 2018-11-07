import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Of_Interest_Widget.onCreated(function studentOfInterestWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
});

const availableCourses = () => {
  const courses = _.filter(Courses.find({}).fetch(), (c) => !c.retired);
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
    return (matching < 7) ? matching : matching.slice(0, 6);
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

const availableOpps = () => {
  const opps = Opportunities.find({}).fetch();
  const notRetired = _.filter(opps, (o) => !o.retired);
  const currentSemester = Semesters.getCurrentSemesterDoc();
  if (notRetired.length > 0) {
    const filteredBySem = _.filter(notRetired, function filter(opp) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opp._id,
      }).fetch();
      return oi.length === 0;
    });
    const filteredByInstance = _.filter(filteredBySem, function filter(opp) {
      let inFuture = false;
      _.forEach(opp.semesterIDs, (semID) => {
        const sem = Semesters.findDoc(semID);
        if (sem.semesterNumber >= currentSemester.semesterNumber) {
          inFuture = true;
        }
      });
      return inFuture;
    });
    return filteredByInstance;
  }
  return [];
};

// TODO Can we move this code into some sort of helperFunction file? I've seen this a lot.
function matchingOpportunities() {
  const allOpportunities = availableOpps();
  const matching = [];
  const profile = Users.getProfile(getRouteUserName());
  const userInterests = [];
  let opportunityInterests = [];
  _.forEach(Users.getInterestIDs(profile.userID), (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.forEach(allOpportunities, (opp) => {
    opportunityInterests = [];
    _.forEach(opp.interestIDs, (id) => {
      opportunityInterests.push(Interests.findDoc(id));
      _.forEach(opportunityInterests, (oppInterest) => {
        _.forEach(userInterests, (userInterest) => {
          if (_.isEqual(oppInterest, userInterest)) {
            if (!_.includes(matching, opp)) {
              matching.push(opp);
            }
          }
        });
      });
    });
  });
  // Only display up to the first six matches.
  return (matching < 7) ? matching : matching.slice(0, 6);
}

function hiddenOpportunitiesHelper() {
  if (getRouteUserName()) {
    const opportunities = matchingOpportunities();
    let nonHiddenOpportunities;
    if (Template.instance().hidden.get()) {
      const profile = Users.getProfile(getRouteUserName());
      nonHiddenOpportunities = _.filter(opportunities, (opp) => {
        if (_.includes(profile.hiddenOpportunityIDs, opp._id)) {
          return false;
        }
        return true;
      });
    } else {
      nonHiddenOpportunities = opportunities;
    }
    return nonHiddenOpportunities;
  }
  return [];
}


Template.Student_Of_Interest_Widget.helpers({
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
      let ret;
      if (this.type === 'courses') {
        ret = profile.hiddenCourseIDs.length !== 0;
      } else {
        ret = profile.hiddenOpportunityIDs.length !== 0;
      }
      return ret;
    }
    return false;
  },
  itemCount() {
    let ret;
    if (this.type === 'courses') {
      ret = hiddenCoursesHelper().length;
    } else {
      ret = hiddenOpportunitiesHelper().length;
    }
    return ret;
  },
  opportunities() {
    const opportunities = matchingOpportunities();
    let visibleOpportunities;
    if (Template.instance().hidden.get()) {
      visibleOpportunities = hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  },
  typeCourse() {
    return this.type === 'courses';
  },
});

Template.Student_Of_Interest_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(true);
  },
});
