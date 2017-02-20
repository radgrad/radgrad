import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Student_Of_Interest_Widget.onCreated(function studentOfInterestWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
  this.subscribe(Courses.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
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
  const allCourses = availableCourses();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let courseInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allCourses, (course) => {
    courseInterests = [];
    _.map(course.interestIDs, (id) => {
      courseInterests.push(Interests.findDoc(id));
      _.map(courseInterests, (courseInterest) => {
        _.map(userInterests, (userInterest) => {
          if (_.isEqual(courseInterest, userInterest)) {
            if (!_.includes(matching, course)) {
              matching.push(course);
            }
          }
        });
      });
    });
  });
  return matching;
}

function hiddenCoursesHelper() {
  const courses = matchingCourses();
  let nonHiddenCourses;
  if (Template.instance().hidden.get()) {
    const user = Users.findDoc({ username: getRouteUserName() });
    nonHiddenCourses = _.filter(courses, (course) => {
      if (_.includes(user.hiddenCourseIDs, course._id)) {
        return false;
      }
      return true;
    });
  } else {
    nonHiddenCourses = courses;
  }
  return nonHiddenCourses;
}

const availableOpps = () => {
  const opps = Opportunities.find({}).fetch();
  const currentSemesterID = Semesters.getCurrentSemester();
  const currentSemester = Semesters.findDoc(currentSemesterID);
  if (opps.length > 0) {
    const filteredBySem = _.filter(opps, function filter(opp) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opp._id,
      }).fetch();
      return oi.length === 0;
    });
    const filteredByInstance = _.filter(filteredBySem, function filter(opp) {
      let inFuture = false;
      _.map(opp.semesterIDs, (semID) => {
        const sem = Semesters.findDoc(semID);
        if (sem.sortBy >= currentSemester.sortBy) {
          inFuture = true;
        }
      });
      return inFuture;
    });
    return filteredByInstance;
  }
  return [];
};

function matchingOpportunities() {
  const allOpportunities = availableOpps();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let opportunityInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allOpportunities, (opp) => {
    opportunityInterests = [];
    _.map(opp.interestIDs, (id) => {
      opportunityInterests.push(Interests.findDoc(id));
      _.map(opportunityInterests, (oppInterest) => {
        _.map(userInterests, (userInterest) => {
          if (_.isEqual(oppInterest, userInterest)) {
            if (!_.includes(matching, opp)) {
              matching.push(opp);
            }
          }
        });
      });
    });
  });
  return matching;
}

function hiddenOpportunitiesHelper() {
  const opportunities = matchingOpportunities();
  let nonHiddenOpportunities;
  if (Template.instance().hidden.get()) {
    const user = Users.findDoc({ username: getRouteUserName() });
    nonHiddenOpportunities = _.filter(opportunities, (opp) => {
      if (_.includes(user.hiddenOpportunityIDs, opp._id)) {
        return false;
      }
      return true;
    });
  } else {
    nonHiddenOpportunities = opportunities;
  }
  return nonHiddenOpportunities;
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
    const user = Users.findDoc({ username: getRouteUserName() });
    let ret;
    if (this.type === 'courses') {
      ret = user.hiddenCourseIDs.length !== 0;
    } else {
      ret = user.hiddenOpportunityIDs.length !== 0;
    }
    return ret;
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

Template.Student_Of_Interest_Widget.onRendered(function studentOfInterestWidgetOnRendered() {

});
