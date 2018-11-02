import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
import * as RouteNames from '../../../startup/client/router.js';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Inspector.onCreated(function inspectorOnCreated() {
  this.state = this.data.dictionary;
});

Template.Inspector.helpers({
  courseDescription() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).description;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.description;
      }
    return null;
  },
  courseEnrollmentData() {
    let courseID;
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      courseID = Template.instance().state.get(plannerKeys.detailCourse)._id;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        courseID = Template.instance().state.get(plannerKeys.detailCourseInstance).courseID;
      }
    if (courseID && Template.instance().state.get(plannerKeys.plannedEnrollment) &&
        courseID === Template.instance().state.get(plannerKeys.plannedEnrollment).courseID) {
      return Template.instance().state.get(plannerKeys.plannedEnrollment).enrollmentData;
    }
    return [];
  },
  courseName() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).name;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.name;
      }
    return null;
  },
  courseNumber() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).number;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.number;
      }
    return null;
  },
  courseIce() {
    if (Template.instance().state.get(plannerKeys.detailICE)) {
      const ice = Template.instance().state.get(plannerKeys.detailICE);
      return ice;
    }
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      const slug = Slugs.findDoc(course.slugID);
      const ice = makeCourseICE(slug.name, 'C');
      return ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
        const ice = ci.ice;
        return ice;
      }
    return null;
  },
  courseSlugID() {
    // logger.trace(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} courseSlugID`);
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailCourse).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return Slugs.getNameFromID(course.slugID);
      }
    return null;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  courses100() {
    const courses = Courses.find({ number: /1\d\d/ }).fetch();
    const instances = CourseInstances.find({ note: /1\d\d/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses200() {
    const courses = Courses.find({ number: /2\d\d/ }).fetch();
    const instances = CourseInstances.find({ note: /2\d\d/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses300() {
    const courses = Courses.find({ number: /3[01234]\d/ }).fetch();
    const instances = CourseInstances.find({ note: /3[01234]\d/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses350() {
    const courses = Courses.find({ number: /3[56789]\d/ }).fetch();
    const instances = CourseInstances.find({ note: /3[56789]\d/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses410() {
    const courses = Courses.find({ number: /4[0123]/ }).fetch();
    const instances = CourseInstances.find({ note: /4[0123]/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses440() {
    const courses = Courses.find({ number: /4[456]/ }).fetch();
    const instances = CourseInstances.find({ note: /4[456]/ }).fetch();
    const courseTakenIDs = _.map(instances, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  courses470() {
    const courses = Courses.find({ number: /4[789]/ }).fetch();
    const instances = CourseInstances.find({ note: /4[789]/ }).fetch();
    let courseTakenIDs = _.filter(instances, function filter(ci) {
      return ci.note.indexOf('499') === -1;
    });
    courseTakenIDs = _.map(courseTakenIDs, (ci) => ci.courseID);
    const ret = _.filter(courses, function filter(c) {
      return _.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret.sort(function compare(a, b) {
      if (a.number < b.number) {
        return -1;
      } else
        if (a.number > b.number) {
          return 1;
        }
      return 0;
    });
  },
  dictionary() {
    return Template.instance().state;
  },
  futureInstance() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.getCurrentSemesterDoc().semesterNumber <= semester.semesterNumber;
    }
    return false;
  },
  getCourse() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course;
      }
    return null;
  },
  getOpportunity() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity);
      }
    return null;
  },
  hasCourse() {
    return Template.instance().state.get(plannerKeys.detailCourse) ||
        Template.instance().state.get(plannerKeys.detailCourseInstance);
  },
  hasOpportunity() {
    return Template.instance().state.get(plannerKeys.detailOpportunity) ||
        Template.instance().state.get(plannerKeys.detailOpportunityInstance);
  },
  hasRequest() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const instance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return VerificationRequests.find({ opportunityInstanceID: instance._id }).count() > 0;
    }
    return false;
  },
  instanceID() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse)._id;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        return Template.instance().state.get(plannerKeys.detailCourseInstance)._id;
      } else
        if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
          return Template.instance().state.get(plannerKeys.detailOpportunity)._id;
        } else
          if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
            return Template.instance().state.get(plannerKeys.detailOpportunityInstance)._id;
          }
    return null;
  },
  instanceSemester() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const semester = Semesters.findDoc(ci.semesterID);
      return Semesters.toString(semester._id, false);
    }
    return null;
  },
  interests() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      const course = Template.instance().state.get(plannerKeys.detailCourse);
      return _.map(course.interestIDs, (iid) => Interests.findDoc(iid));
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return _.map(course.interestIDs, (iid) => Interests.findDoc(iid));
      } else
        if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
          return _.map(Template.instance().state.get(plannerKeys.detailOpportunity).interestIDs, (iid) =>
              Interests.findDoc(iid));
        } else
          if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
            const opp = Opportunities.findDoc(Template.instance().state.get(
                plannerKeys.detailOpportunityInstance).opportunityID);
            return _.map(opp.interestIDs, (iid) => Interests.findDoc(iid));
          }
    return [];
  },
  isInPlan() {
    return (Template.instance().state.get(plannerKeys.detailCourseInstance) ||
        Template.instance().state.get(plannerKeys.detailOpportunityInstance));
  },
  isPastInstance() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      const ciSemester = Semesters.findDoc(ci.semesterID);
      return ciSemester.semesterNumber <= currentSemester.semesterNumber;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
        const studentID = getUserIdFromRoute();
        const requests = VerificationRequests.find({ opportunityInstanceID: oi._id, studentID }).fetch();
        const oppSemester = Semesters.findDoc(oi.semesterID);
        return !oi.verified && oppSemester.semesterNumber <= currentSemester.semesterNumber && requests.length === 0;
      }
    return false;
  },
  missingPrerequisite(prereqSlug) {
    const prereqID = Courses.findIdBySlug(prereqSlug);
    const studentID = getUserIdFromRoute();
    const courseInstances = CourseInstances.find({ studentID }).fetch();
    let ret = true;
    _.forEach(courseInstances, (ci) => {
      if (prereqID === ci.courseID) {
        ret = false;
      }
    });
    return ret;
  },
  notFromSTAR() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      return !ci.fromSTAR;
    }
    return false;
  },
  opportunities() {
    const opportunities = Opportunities.find().fetch();
    const notRetired = _.filter(opportunities, (o) => !o.retired);
    return _.sortBy(notRetired, opportunity => opportunity.name);
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunityDescription() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp.description;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).description;
      }
    return null;
  },
  opportunityIce() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      return Opportunities.findDoc(oi.opportunityID).ice;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).ice;
      }
    return null;
  },
  opportunityName() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const opp = Opportunities.findDoc({ _id: oi.opportunityID });
      return opp.name;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        return Template.instance().state.get(plannerKeys.detailOpportunity).name;
      }
    return null;
  },
  opportunityMenuName(opportunity) {
    const iceString = `(${opportunity.ice.i}/${opportunity.ice.c}/${opportunity.ice.e})`;
    return `${opportunity.name} ${iceString}`;
  },
  opportunitySemester() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const semester = OpportunityInstances.getSemesterDoc(oi._id);
      return `${semester.term} ${semester.year}`;
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
        const opportunity = Template.instance().state.get(plannerKeys.detailOpportunity);
        let semesterStr = '';
        opportunity.semesterIDs.forEach((sem) => {
          semesterStr += Semesters.toString(sem, false);
          semesterStr += ', ';
        });
        return semesterStr.substring(0, semesterStr.length - 2);
      }
    return null;
  },
  opportunitySlugID() {
    if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
      return Slugs.getNameFromID(Template.instance().state.get(plannerKeys.detailOpportunity).slugID);
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
        const opp = Opportunities.findDoc({ _id: oi.opportunityID });
        return Slugs.getNameFromID(opp.slugID);
      }
    return null;
  },
  passedCourse() {
    if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
      const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
      // console.log(ci);
      if (ci.fromSTAR && ci.verified) {
        if (ci.grade === 'A+' || ci.grade === 'A' || ci.grade === 'A-' ||
            ci.grade === 'B+' || ci.grade === 'B') {
          return true;
        }
      }
    }
    return false;
  },
  prerequisites() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse).prerequisites;
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        const course = Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
        return course.prerequisites;
      }
    return [];
  },
  requestHistory() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        return request[0].processed;
      }
    }
    return '';
  },
  requestStatus() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        return request[0].status;
      }
    }
    return '';
  },
  requestWhenSubmitted() {
    if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
      const oppInstance = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
      const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id }).fetch();
      if (request.length > 0) {
        const submitted = moment(request[0].submittedOn);
        return submitted.calendar();
      }
    }
    return '';
  },
  selectedCourse() {
    if (Template.instance().state.get(plannerKeys.detailCourse)) {
      return Template.instance().state.get(plannerKeys.detailCourse);
    } else
      if (Template.instance().state.get(plannerKeys.detailCourseInstance)) {
        return Courses.findDoc(Template.instance().state.get(plannerKeys.detailCourseInstance).courseID);
      }
    return null;
  },
  selectedOpportunity() {
    if (Template.instance().state.get(plannerKeys.detailOpportunity)) {
      return Template.instance().state.get(plannerKeys.detailOpportunity);
    } else
      if (Template.instance().state.get(plannerKeys.detailOpportunityInstance)) {
        // eslint-disable-next-line
        return Opportunities.findDoc(Template.instance().state.get(plannerKeys.detailOpportunityInstance).opportunityID);
      }
    return null;
  },
  unverified() {
    let ret = false;
    const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
    if (!oi.verified) {
      ret = true;
    }
    return ret;
  },
});

Template.Inspector.events({
  'click .course.item': function clickCourseItem(event) {
    event.preventDefault();
    const course = Courses.findDoc(event.target.id);
    Template.instance().state.set(plannerKeys.detailCourse, course);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, null);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
    const instance = Template.instance();
    getFutureEnrollmentMethod.call(event.target.id, (error, result) => {
      if (error) {
        console.log('Error in getting future enrollment', error);
      } else
        if (course._id === result.courseID) {
          instance.state.set(plannerKeys.plannedEnrollment, result);
        }
    });
  },
  'click .opportunity.item': function clickOpportunityItem(event) {
    event.preventDefault();
    const opportunity = Opportunities.findDoc(event.target.id);
    Template.instance().state.set(plannerKeys.detailCourse, null);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, opportunity);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
  },
  'click button.verifyInstance': function clickButtonVerifyInstance(event) {
    event.preventDefault();
    const id = event.target.id;
    const definitionData = { student: getRouteUserName(), opportunityInstance: id };
    const collectionName = VerificationRequests.getCollectionName();
    defineMethod.call({ collectionName, definitionData });
    const typeData = Slugs.getNameFromID(OpportunityInstances.getOpportunityDoc(id).slugID);
    const interactionData = { username: getRouteUserName(), type: 'verifyRequest', typeData };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Inspector.onRendered(function inspectorOnRendered() {
  // logger.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Inspector.onRendered`);
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
  });
});
