import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Inspector_Panel.helpers({
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

Template.Inspector_Panel.events({
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
});

Template.Inspector_Panel.onCreated(function () {
  this.state = new ReactiveDict();
});

Template.Inspector_Panel.onRendered(function () {
  console.log(this.data);
  if (this.data) {
    this.state.set('currentSemesterID', this.data.currentSemesterID);
    this.state.set('studentUsername', this.data.studentUserName);
    this.state.set('inspectID', this.data.inspectID);
  }
});

Template.Inspector_Panel.onDestroyed(function () {
  //add your statement here
});

