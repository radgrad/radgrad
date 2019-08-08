import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getEarnedICE } from '../../../api/ice/IceProcessor';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';

function getEventsHelper(iceType, type, earned, semester) {
  if (getUserIdFromRoute()) {
    const profile = Users.getProfile(getUserIdFromRoute());
    let allInstances = [];
    const iceInstances = [];
    if (type === 'course') {
      const courseInstances = CourseInstances.findNonRetired({ semesterID: semester._id, studentID: profile.userID,
        verified: earned });
      courseInstances.forEach(courseInstance => allInstances.push(courseInstance));
    } else {
      allInstances = OpportunityInstances.findNonRetired({ semesterID: semester._id, studentID: profile.userID,
        verified: earned });
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

Template.Alumni_Ice_Column.helpers({
  competencyPoints(ice) {
    return ice.c;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  earnedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.findNonRetired({ studentID: profile.userID, verified: true });
      const oppInstances = OpportunityInstances.findNonRetired({ studentID: profile.userID, verified: true });
      const earnedInstances = courseInstances.concat(oppInstances);
      return getEarnedICE(earnedInstances);
    }
    return null;
  },
  eventIce(event) {
    return event.ice;
  },
  getEvents(type, earned, semester) {
    return getEventsHelper(this.type, type, earned, semester);
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
  matchingPoints(a, b) {
    return a <= b;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    return opportunity.name;
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
    const ay = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
    return ay;
  },
});
