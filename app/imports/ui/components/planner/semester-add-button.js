import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';

const logger = new Logger('SB');

const availableCourses = () => {
  if (getRouteUserName()) {
    const courses = Courses.find({}).fetch();
    if (courses.length > 0 && Template.instance().localState.get('semester')) {
      const filtered = _.filter(courses, function filter(course) {
        if (course.number === 'ICS 499') {
          return true;
        }
        const ci = CourseInstances.find({
          courseID: course._id,
          grade: /[AB]/,
        }).fetch();
        return ci.length === 0;
      });
      return filtered;
    }
    return [];
  }
  return [];
};

const available1xxCourses = () => {
  const courses = availableCourses();
  const filtered = _.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 1';
  });
  return filtered;
};

const available2xxCourses = () => {
  const courses = availableCourses();
  const filtered = _.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 2';
  });
  return filtered;
};

const available3xxCourses = () => {
  const courses = availableCourses();
  const filtered = _.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 3';
  });
  return filtered;
};

const available4xxCourses = () => {
  const courses = availableCourses();
  const filtered = _.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 4';
  });
  return filtered;
};

const filterByRangeAZ = (list, range) => {
  const ret = _.filter(list, function filter(opportunity) {
    return range.indexOf(opportunity.name.charAt(0).toLowerCase()) !== -1;
  });
  return ret;
};

const createOpportunityRange = (oppList) => {
  const ret = {
    AToE: [],
    FToJ: [],
    KToO: [],
    PToT: [],
    UToZ: [],
  };

  const rangeAToE = ['a', 'b', 'c', 'd', 'e'];
  const rangeFToJ = ['f', 'g', 'h', 'i', 'j'];
  const rangeKToO = ['k', 'l', 'm', 'n', 'o'];
  const rangePToT = ['p', 'q', 'r', 's', 't'];
  const rangeUToZ = ['u', 'v', 'w', 'x', 'y', 'z'];

  ret.AToE = filterByRangeAZ(oppList, rangeAToE);
  ret.FToJ = filterByRangeAZ(oppList, rangeFToJ);
  ret.KToO = filterByRangeAZ(oppList, rangeKToO);
  ret.PToT = filterByRangeAZ(oppList, rangePToT);
  ret.UToZ = filterByRangeAZ(oppList, rangeUToZ);

  return ret;
};

const availableOpportunities = () => {
  if (getRouteUserName()) {
    const opportunities = Opportunities.find({}).fetch();
    if (opportunities.length > 0 && Template.instance().localState.get('semester')) {
      const filtered = _.filter(opportunities, function filter(opportunity) {
        const oi = OpportunityInstances.find({
          studentID: getUserIdFromRoute(),
          courseID: opportunity._id,
        }).fetch();
        return oi.length === 0;
      });
      return filtered;
    }
    return [];
  }
  return [];
};

Template.Semester_Add_Button.onCreated(function semesterAddButtonOnCreated() {
  logger.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Semester_Add_Button.onCreated`);
  if (this.data) {
    this.localState = this.data.localState;
    this.state = this.data.dictionary;
  }
});

Template.Semester_Add_Button.helpers({
  courses(level) {
    const ret = [];
    const courses = availableCourses();
    courses.forEach((course) => {
      const cNumber = course.number;
      const cLabel = `${course.number} ${course.shortName}`;
      switch (level) {
        case 100:
          if (cNumber.substring(0, 5) === 'ICS 1') {
            ret.push(cLabel);
          }
          break;
        case 200:
          if (cNumber.substring(0, 5) === 'ICS 2') {
            ret.push(cLabel);
          }
          break;
        case 300:
          if (cNumber.substring(0, 5) === 'ICS 3') {
            ret.push(cLabel);
          }
          break;
        case 400:
          if (cNumber.substring(0, 5) === 'ICS 4') {
            ret.push(cLabel);
          }
          break;
        default:
          break;
      }
    });
    return ret;
  },
  hasCourses(level) {
    let ret = false;
    switch (level) {
      case 100:
        ret = available1xxCourses().length !== 0;
        break;
      case 200:
        ret = available2xxCourses().length !== 0;
        break;
      case 300:
        ret = available3xxCourses().length !== 0;
        break;
      case 400:
        ret = available4xxCourses().length !== 0;
        break;
      default:
        ret = false;
    }
    return ret;
  },
  loggedIn() {
    return (getRouteUserName() !== null);
  },
  opportunities() {
    let ret = [];
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      const opportunities = availableOpportunities();
      ret = _.filter(opportunities, function filter(o) {
        return _.indexOf(o.semesterIDs, semester._id) !== -1;
      });
      ret = _.sortBy(ret, 'name');
      ret = createOpportunityRange(ret);
    }
    return ret;
  },
});

Template.Semester_Add_Button.events({
  'click .item.addClass': function clickItemAddClass(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const courseSplit = event.target.text.split(' ');
    const courseSlug = `${courseSplit[0].toLowerCase()}${courseSplit[1]}`;
    const semester = template.localState.get('semester');
    const semStr = Semesters.toString(semester._id, false);
    const semSplit = semStr.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Users.findDoc(getUserIdFromRoute()).username;
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: event.target.text.substring(0, 7),
      grade: 'B',
      student: username,
    };
    const id = CourseInstances.define(ci);
    FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
    FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
    FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
    FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
    // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
    FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
    template.state.set(plannerKeys.detailCourse, null);
    template.state.set(plannerKeys.detailCourseInstance, CourseInstances.findDoc(id));
    Tracker.afterFlush(() => {
      template.$('.ui.icon.mini.button')
          .popup({
            on: 'click',
          });
      template.$('.item.oneHundredLevel')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.200.item')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.300.item')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('a.400.item')
          .popup({
            inline: true,
            hoverable: true,
            lastResort: 'right center',
          });
    });
  },
  'click .item.addOpportunity': function clickItemAddOpportunity(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const name = event.target.text;
    const opportunity = Opportunities.find({ name }).fetch()[0];
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const semester = template.localState.get('semester');
    const semStr = Semesters.toString(semester._id, false);
    const semSplit = semStr.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Users.findDoc(getUserIdFromRoute()).username;
    const oi = {
      semester: semSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    const id = OpportunityInstances.define(oi);
    template.state.set(plannerKeys.detailOpportunityInstance, OpportunityInstances.findDoc(id));
  },
});

Template.Semester_Add_Button.onRendered(function semesterAddButtonOnRendered() {
  logger.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Semester_Add_Button.onRendered`);
  const template = this;
  template.$('.ui.button')
      .popup({
        on: 'click',
      });
  template.$('.item.addCourseMenu')
      .popup({
        inline: false,
        hoverable: true,
        position: 'right center',
        lastResort: 'right center',
      });
  template.$('.item.addOpportunityMenu')
      .popup({
        inline: false,
        hoverable: true,
        position: 'right center',
        lastResort: 'right center',
      });
  template.$('.item.oneHundredLevel')
      .popup({
        inline: true,
        hoverable: true,
      });
  template.$('a.200.item')
      .popup({
        inline: false,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.300.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.400.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.AToE.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.FToJ.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.KToO.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.PToT.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
  template.$('a.UToZ.item')
      .popup({
        inline: true,
        hoverable: true,
        lastResort: 'right center',
      });
});
