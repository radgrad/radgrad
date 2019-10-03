import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getEarnedICE, getProjectedICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';

function getEventsHelper(iceType, type, earned, semester) {
  if (getUserIdFromRoute()) {
    const profile = Users.getProfile(getUserIdFromRoute());
    let allInstances = [];
    const iceInstances = [];
    if (type === 'course') {
      const courseInstances = CourseInstances.find({ semesterID: semester._id, studentID: profile.userID,
        verified: earned }).fetch();
      courseInstances.forEach(courseInstance => allInstances.push(courseInstance));
    } else {
      allInstances = OpportunityInstances.find({ semesterID: semester._id, studentID: profile.userID,
        verified: earned }).fetch();
    }
    allInstances.forEach((instance) => {
      if (iceType === 'Innovation') {
        if (instance.ice.i > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'Competency') {
        if (instance.ice.c > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'Experience') {
        if (instance.ice.e > 0) {
          iceInstances.push(instance);
        }
      }
    });
    return iceInstances;
  }
  return null;
}

const availableCourses = () => {
  const courses = Courses.findNonRetired({});
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
  return matching;
}

function matchingOpportunities() {
  const allOpportunities = Opportunities.findNonRetired();
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
  return matching;
}

Template.Student_Ice_Column.helpers({
  competencyPoints(ice) {
    return ice.c;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  courseSlug(course) {
    if (course.courseID) {
      return Slugs.findDoc(Courses.findDoc(course.courseID).slugID).name;
    }
    return Slugs.findDoc(course.slugID).name;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  earnedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getEarnedICE(earnedInstances);
    }
    return null;
  },
  eventIce(event) {
    return event.ice;
  },
  experiencePoints(ice) {
    return ice.e;
  },
  getEvents(type, earned, semester) {
    return getEventsHelper(this.type, type, earned, semester);
  },
  greaterThan100(num) {
    if (num > 100) {
      return 100;
    }
    return num;
  },
  getTypeColors() {
    const typeColor = {
      color: '',
      projColor: '',
    };
    switch (this.type) {
      case 'Innovation':
        typeColor.color = 'ice-innovation-color';
        typeColor.projColor = 'ice-innovation-proj-color';
        return typeColor;
      case 'Competency':
        typeColor.color = 'ice-competency-color';
        typeColor.projColor = 'ice-competency-proj-color';
        return typeColor;
      case 'Experience':
        typeColor.color = 'ice-experience-color';
        typeColor.projColor = 'ice-experience-proj-color';
        return typeColor;
      default:
        return typeColor;
    }
  },
  hasEvents(earned, semester) {
    let ret = false;
    if ((getEventsHelper(this.type, 'course', earned, semester).length > 0) ||
        (getEventsHelper(this.type, 'opportunity', earned, semester).length > 0)) {
      ret = true;
    }
    return ret;
  },
  hasNoInterests() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return user.interestIDs === undefined || user.interestIDs.length === 0;
    }
    return false;
  },
  innovationPoints(ice) {
    return ice.i;
  },
  isType(type) {
    return type === this.type;
  },
  matchingPoints(a, b) {
    return a <= b;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    return opportunity.name;
  },
  opportunitySlug(opportunity) {
    if (opportunity.opportunityID) {
      return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
    }
    return Slugs.findDoc(opportunity.slugID).name;
  },
  projectedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: profile.userID }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: profile.userID }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getProjectedICE(earnedInstances);
      return ice;
    }
    return null;
  },
  points(ice) {
    if (ice) {
      let ret;
      if (this.type === 'Innovation') {
        ret = ice.i;
      } else if (this.type === 'Competency') {
        ret = ice.c;
      } else if (this.type === 'Experience') {
        ret = ice.e;
      }
      return ret;
    }
    return 0;
  },
  printSemester(semester) {
    return Semesters.toString(semester._id, false);
  },
  recommendedEvents(projected) {
    if (getUserIdFromRoute()) {
      let allInstances = [];
      const recommendedInstances = [];
      let totalIce = 0;
      const remainder = 100 - projected;
      if (this.type === 'Competency') {
        allInstances = matchingCourses();
      } else {
        allInstances = matchingOpportunities();
      }

      if (this.type === 'Innovation') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            if (instance.ice.i > 0) {
              totalIce += instance.ice.i;
              recommendedInstances.push(instance);
            }
          }
        });
      } else if (this.type === 'Competency') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            totalIce += 9; // assume A grade
            recommendedInstances.push(instance);
          }
        });
      } else if (this.type === 'Experience') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            if (instance.ice.e > 0) {
              totalIce += instance.ice.e;
              recommendedInstances.push(instance);
            }
          }
        });
      } else {
        return null;
      }
      return recommendedInstances;
    }
    return null;
  },
  remainingICE(earned, planned) {
    return planned - earned;
  },
  semesters(year) {
    const yearSemesters = [];
    const semIDs = year.semesterIDs;
    _.forEach(semIDs, (semID) => {
      yearSemesters.push(Semesters.findDoc(semID));
    });
    return yearSemesters;
  },
  years() {
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ay;
  },
});

Template.Student_Ice_Column.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title',
    },
    exclusive: false,
  });
});

