import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';

function getEventsHelper(iceType, type, earned, semester) {
  if (getUserIdFromRoute()) {
    const user = Users.findDoc(getUserIdFromRoute());
    let allInstances = [];
    const iceInstances = [];
    if (type === 'course') {
      const courseInstances = CourseInstances.find({ semesterID: semester._id, studentID: user._id,
        verified: earned }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (CourseInstances.isICS(courseInstance._id)) {
          allInstances.push(courseInstance);
        }
      });
    } else {
      allInstances = OpportunityInstances.find({ semesterID: semester._id, studentID: user._id,
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
  _.map(Users.getInterestIDs(user._id), (id) => {
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

function matchingOpportunities() {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let opportunityInterests = [];
  _.map(Users.getInterestIDs(user._id), (id) => {
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
      const user = Users.findDoc(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
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
    const user = Users.findDoc({ username: getRouteUserName() });
    return user.interestIDs === undefined;
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
  opportunitySemesters(opp) {
    const semesters = opp.semesterIDs;
    let semesterNames = '';
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    _.map(semesters, (sem) => {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        semesterNames = semesterNames.concat(`${Semesters.toString(sem)}, `);
      }
    });
    return semesterNames.slice(0, -2); // removes unnecessary comma and space
  },
  opportunitySlug(opportunity) {
    if (opportunity.opportunityID) {
      return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
    }
    return Slugs.findDoc(opportunity.slugID).name;
  },
  plannedICE() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: user._id }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getPlanningICE(earnedInstances);
      return ice;
    }
    return null;
  },
  points(ice) {
    let ret;
    if (this.type === 'Innovation') {
      ret = ice.i;
    } else if (this.type === 'Competency') {
      ret = ice.c;
    } else if (this.type === 'Experience') {
      ret = ice.e;
    }
    return ret;
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
    _.map(semIDs, (semID) => {
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

Template.Student_Ice_Column.events({
  // add events here
});

Template.Student_Ice_Column.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title',
    },
    exclusive: false,
  });
});

