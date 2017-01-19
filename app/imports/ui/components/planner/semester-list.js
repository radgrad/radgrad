import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveDict } from 'meteor/reactive-dict';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Logger } from 'meteor/jag:pince';
import { moment } from 'meteor/momentjs:moment';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { checkPrerequisites } from './course-functions';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0 && Template.instance().localState.get('semester')) {
    const filtered = lodash.filter(courses, function filter(course) {
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

const available1xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 1';
  });
  return filtered;
};

const available2xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 2';
  });
  return filtered;
};

const available3xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 3';
  });
  return filtered;
};

const available4xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function filter(course) {
    return course.number.substring(0, 5) === 'ICS 4';
  });
  return filtered;
};

const availableOpportunities = () => {
  const opportunities = Opportunities.find({}).fetch();
  if (opportunities.length > 0 && Template.instance().localState.get('semester')) {
    const filtered = lodash.filter(opportunities, function filter(opportunity) {
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: opportunity._id,
      }).fetch();
      return oi.length === 0;
    });
    return filtered;
  }
  return [];
};

Template.Semester_List.helpers({
  courseDescription(courseID) {
    const ci = CourseInstances.find({ courseID }).fetch();
    const course = Courses.find({ _id: ci[0].courseID }).fetch();
    return course[0].description;
  },
  courseICE(courseID) {
    const opp = CourseInstances.find({ courseID }).fetch();
    return opp[0].ice;
  },
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
  hasGrade(courseInstanceID) {
    const ci = CourseInstances.findDoc(courseInstanceID);
    return ci.grade !== '***';
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().localState.get('semester')._id,
        studentID: getUserIdFromRoute(),
      }, { sort: { note: 1 } }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  isCurrentSemester() {
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy === currentSemester.sortBy;
    }
    return false;
  },
  isFuture() {
    const semester = Template.instance().localState.get('semester');
    const currentSemester = Template.instance().localState.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy >= currentSemester.sortBy;
    }
    return false;
  },
  isGrade(courseInstanceID, grade) {
    // const logger = new Logger('semester-list.isGrade');
    try {
      // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} ${courseInstanceID}, ${grade}`);
      const ci = CourseInstances.findDoc(courseInstanceID);
      return ci.grade === grade;
      /* eslint no-unused-vars: "off" */
    } catch (e) {
      return null;
    }
  },
  nonIcsCourses() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().localState.get('semester')._id,
        studentID: getUserIdFromRoute(),
      }).fetch();
      courses.forEach((c) => {
        if (!CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  opportunities() {
    let ret = [];
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      const opportunities = availableOpportunities();
      const now = new Date();
      ret = lodash.filter(opportunities, function filter(o) {
        return lodash.indexOf(o.semesterIDs, semester._id) !== -1;
      });
    }
    return ret;
  },
  opportunityDescription(opportunityID) {
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      return opportunity[0].description;
    }
    return null;
  },
  opportunityMoreInformation(opportunityID) {
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      return opportunity[0].moreInformation;
    }
    return null;
  },
  opportunityName(opportunityID) {
    const opp = OpportunityInstances.find({ _id: opportunityID }).fetch();
    if (opp.length > 0) {
      const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
      return opportunity[0].name;
    }
    return null;
  },
  opportunityICE(opportunityID) {
    const opp = OpportunityInstances.find({ opportunityID }).fetch();
    return opp[0].ice;
  },
  semesterName() {
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.term;
    }
    return null;
  },
  semesterOpportunities() {
    const ret = [];
    if (Template.instance().localState.get('semester')) {
      const opps = OpportunityInstances.find({
        semesterID: Template.instance().localState.get('semester')._id,
        studentID: getUserIdFromRoute(),
      }).fetch();
      return opps;
    }
    return ret;
  },
  year() {
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
});

Template.Semester_List.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const semesterId = Template.instance().localState.get('semester')._id;
      if (CourseInstances.isDefined(id)) {
        CourseInstances.updateSemester(id, semesterId);
        checkPrerequisites();
      } else {
        const opportunities = OpportunityInstances.find({
          studentID: getUserIdFromRoute(),
          _id: id,
        }).fetch();
        if (opportunities.length > 0) {
          OpportunityInstances.updateSemester(opportunities[0]._id, semesterId);
        }
      }
    }
  },
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
      note: event.target.text,
      grade: 'B',
      student: username,
    };
    CourseInstances.define(ci);
    checkPrerequisites();
    Tracker.afterFlush(() => {
      template.$('.ui.icon.mini.button')
          .popup({
            on: 'click',
          });
      template.$('a.100.item')
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
      template.$('.ui.selection.dropdown').dropdown();
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
    OpportunityInstances.define(oi);
  },
  'click .item.grade': function clickItemGrade(event) {
    event.preventDefault();
    const template = Template.instance();
    const div = event.target.parentElement.parentElement;
    const grade = div.childNodes[1].value;
    const logger = new Logger('semester-list.clickItemGrade');
    // const body = $('body');
    // body.addClass('waiting');
    // eslint-disable-next-line max-len
    logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} about to call CourseInstances.clientUpdateGrade(${div.id}, ${grade})`);
    CourseInstances.clientUpdateGrade(div.id, grade);
    const ci = CourseInstances.findDoc(div.id);
    logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} find returned id: ${ci._id} with grade ${ci.grade}`);
    template.state.set(plannerKeys.detailICE, ci.ice);
    logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} set ICE to {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}}`);
    template.state.set(plannerKeys.detailCourseInstance, ci);
    // Tracker.flush();
    // eslint-disable-next-line max-len
    logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}} ${ci.grade} ${template.state.get(plannerKeys.detailCourseInstance).grade}`);
  },
  'click .jsDelCourse': function clickJsDelCourse(event) {
    // event.preventDefault();
    // console.log(event.target);
    const id = event.target.id;
    CourseInstances.removeIt(id);
  },
  'click .jsDelOpp': function clickJsDelOpp(event) {
    event.preventDefault();
    // console.log(event.target);
    const id = event.target.id;
    OpportunityInstances.removeIt(id);
  },
});

Template.Semester_List.onCreated(function semesterListOnCreate() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});

Template.Semester_List.onRendered(function semesterListOnRendered() {
  // console.log(this.data);
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.button')
        .popup({
          on: 'click',
        });
    template.$('.item.addCourseMenu')
        .popup({
          inline: false,
          hoverable: true,
        });
    template.$('.item.addOpportunityMenu')
        .popup({
          inline: false,
          hoverable: true,
          position: 'right center',
          lastResort: 'right center',
        });
    template.$('a.100.item')
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
    template.$('.ui.selection.dropdown').dropdown();
  });
});

Template.Semester_List.onDestroyed(function semesterListOnDestroyed() {
  // add your statement here
});

