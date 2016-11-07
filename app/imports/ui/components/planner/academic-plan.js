import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { lodash } from 'meteor/erasaur:meteor-lodash';

const studentSemesters = () => {
  const user = Users.find({ username: Template.instance().state.get('studentUsername') }).fetch();
  const courseInstances = CourseInstances.find({ studentID: user[0]._id }).fetch();
  const ids = [];
  courseInstances.forEach((ci) => {
    if (lodash.indexOf(ids, ci.semesterID) === -1) {
      ids.push(ci.semesterID);
    }
  });
  const ret = [];
  ids.forEach((id) => {
    ret.push(Semesters.findDoc(id));
  });
  return lodash.orderBy(ret, ['sortBy'], ['asc']);
};

const academicYears = () => {
  const ret = {};
  const semesters = studentSemesters();
  semesters.forEach((semester) => {
    let year = 0;
    if (semester.term === Semesters.FALL) {
      year = semester.year;
    } else {
      year = semester.year - 1;
    }
    if (!ret[year]) {
      ret[year] = { year, springYear: year + 1 };
    }
    if (!ret[year].semesters) {
      ret[year].semesters = {};
    }
    ret[year].semesters[semester.term] = semester;
  });
  return ret;
};

Template.Academic_Plan_2.helpers({
  args(ay) {
    return {
      year: ay,
      currentSemester: Semesters.findDoc(Semesters.getCurrentSemester()),
    };
  },
  years() {
    const ay = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    const instance = Template.instance();
    if (ay.length > 0 && !instance.state.get('startYear')) {
      instance.state.set('startYear', ay[ay.length - 1].year);
    }
    const ret = lodash.filter(ay, function filter(academicYear) {
      const year = academicYear.year;
      if (year >= instance.state.get('startYear') - 4 && year <= instance.state.get('startYear')) {
        return true;
      }
      return false;
    });
    return ret;
  },
  hasMoreYears() {
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays.length > 4;
  },
  hasPrevYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays[0].year < instance.state.get('startYear') - 4;
  },
  hasNextYear() {
    const instance = Template.instance();
    const ays = AcademicYearInstances.find({ studentID: Meteor.userId() }, { sort: { year: 1 } }).fetch();
    return ays[ays.length - 1].year > instance.state.get('startYear');
  },
  fallArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year,
        term: Semesters.FALL,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  springArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  summerArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SUMMER,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  inspectArgs() {
    if (Template.instance().state.get('currentSemesterID')) {
      const inspectID = Template.instance().state.get('inspectID');
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const studentUsername = Template.instance().state.get('studentUsername');
      return { inspectID, currentSemester, studentUsername };
    }
    return null;
  },
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const instances = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
    const courseTakenIDs = [];
    instances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        if (courseInstance.note !== 'ICS 499') {
          courseTakenIDs.push(courseInstance.courseID);
        }
      }
    });
    ret = lodash.filter(courses, function filter(c) {
      if (c.number === 'other') {
        return false;
      }
      return lodash.indexOf(courseTakenIDs, c._id) === -1;
    });
    return ret;
  },
  detailCourseNumber() {
    const course = Courses.find({ _id: Template.instance().state.get('detailCourseID') }).fetch();
    return course[0];
  },
  hasCourse() {
    return Template.instance().state.get('detailCourseID');
  },
  courseNumber() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.number;
    }
    return null;
  },
  courseName() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.name;
    }
    return null;
  },
  courseIce() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.ice;
    }
    return null;
  },
  courseDescription() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.description;
    }
    return null;
  },
  opportunities() {
    let ret = [];
    const opportunities = Opportunities.find().fetch();
    const now = new Date();
    // console.log(opportunities[0]);
    ret = lodash.filter(opportunities, function filter(o) {
      return (now >= o.startActive && now <= o.endActive);
    });
    return ret;
  },
  hasOpportunity() {
    return Template.instance().state.get('detailOpportunityID');
  },
  opportunityName() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.name;
    }
    return null;
  },
  opportunityDescription() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.description;
    }
    return null;
  },
  opportunityIce() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.ice;
    }
    return null;
  },
  opportunityStart() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.startActive.toDateString();
    }
    return null;
  },
  opportunityEnd() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.endActive.toDateString();
    }
    return null;
  },
  opportunityMore() {
    if (Template.instance().state.get('detailOpportunityID')) {
      const id = Template.instance().state.get('detailOpportunityID');
      const opportunity = Opportunities.findDoc({ _id: id });
      return opportunity.moreInformation;
    }
    return null;
  },
});

Template.Academic_Plan_2.events({
  'click .item.del'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    if (split.length === 2) {
      const ci = CourseInstances.find({ note: split[1], studentID: Meteor.userId() }).fetch();
      if (ci.length === 1) {
        CourseInstances.removeIt(ci[0]);
      } else {
        const oi = OpportunityInstances.find({ _id: split[1], studentID: Meteor.userId() }).fetch();
        if (oi.length === 1) {
          OpportunityInstances.removeIt(oi[0]);
        }
      }
    }
  },
  'click .item.inspect.course'(event) {
    event.preventDefault();
    // console.log(event);
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    const courseArr = Courses.find({ number: split[1] }).fetch();
    if (courseArr.length > 0) {
      template.state.set('detailCourseID', courseArr[0]._id);
      template.state.set('detailOpportunityID', null);
    }
  },
  'click .item.inspect.opportunity'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    const courseArr = OpportunityInstances.find({ _id: split[1] }).fetch();
    if (courseArr.length > 0) {
      template.state.set('detailCourseID', null);
      template.state.set('detailOpportunityID', courseArr[0].opportunityID);
    }
  },
  'click .course.item'(event) {
    event.preventDefault();
    const courseArr = Courses.find({ _id: event.target.id }).fetch();
    if (courseArr.length > 0) {
      Template.instance().state.set('detailCourseID', event.target.id);
      Template.instance().state.set('detailOpportunityID', null);
    }
  },
  'click .opportunity.item'(event) {
    event.preventDefault();
    const opportunityArr = Opportunities.find({ _id: event.target.id }).fetch();
    if (opportunityArr.length > 0) {
      Template.instance().state.set('detailCourseID', null);
      Template.instance().state.set('detailOpportunityID', event.target.id);
    }
  },
  'click #nextYear'(event) {
    event.preventDefault();
    const year = Template.instance().state.get('startYear');
    Template.instance().state.set('startYear', year + 1);
  },
  'click #prevYear'(event) {
    event.preventDefault();
    const year = Template.instance().state.get('startYear');
    Template.instance().state.set('startYear', year - 1);
  },
});

Template.Academic_Plan_2.onCreated(function academicPlan2OnCreated() {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan_2.onRendered(function academicPlan2OnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan_2.onDestroyed(function academicPlan2OnDestroyed() {
  // add your statement here
});

