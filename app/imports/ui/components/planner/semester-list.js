import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveDict } from 'meteor/reactive-dict';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { checkPrerequisites } from '../../../api/course/CourseFunctions';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0 && Template.instance().state.get('semester')) {
    const filtered = lodash.filter(courses, function (course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: Meteor.userId(),
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
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 1';
  });
  return filtered;
};

const available2xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 2';
  });
  return filtered;
};

const available3xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 3';
  });
  return filtered;
};

const available4xxCourses = () => {
  const courses = availableCourses();
  const filtered = lodash.filter(courses, function (course) {
    return course.number.substring(0, 5) === 'ICS 4';
  });
  return filtered;
};

const availableOpportunities = () => {
  const opportunities = Opportunities.find({}).fetch();
  if (opportunities.length > 0 && Template.instance().state.get('semester')) {
    const filtered = lodash.filter(opportunities, function (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: Meteor.userId(),
        courseID: opportunity._id,
      }).fetch();
      return oi.length === 0;
    });
    return filtered;
  }
  return [];
};

const resizePopup = () => {
  $('.ui.popup').css('max-height', '350px');
};

$(window).resize(function (e) {
  resizePopup();
});

Template.Semester_List.helpers({
  semesterName() {
    const semester = Template.instance().state.get('semester');
    if (semester) {
      return semester.term;
    }
    return null;
  },
  year() {
    const semester = Template.instance().state.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
  isFuture() {
    const semester = Template.instance().state.get('semester');
    const currentSemester = Template.instance().state.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy >= currentSemester.sortBy;
    }
    return null;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }, { sort: { note: 1 } }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
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
  courses(level) {
    const ret = [];
    const courses = availableCourses();
    courses.forEach((course) => {
      const cNumber = course.number;
      switch (level) {
        case 100:
          if (cNumber.substring(0, 5) === 'ICS 1') {
            ret.push(cNumber);
          }
          break;
        case 200:
          if (cNumber.substring(0, 5) === 'ICS 2') {
            ret.push(cNumber);
          }
          break;
        case 300:
          if (cNumber.substring(0, 5) === 'ICS 3') {
            ret.push(cNumber);
          }
          break;
        case 400:
          if (cNumber.substring(0, 5) === 'ICS 4') {
            ret.push(cNumber);
          }
          break;
        default:
          break;
      }
    });
    return ret;
  },
  nonIcsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
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
    const opportunities = availableOpportunities();
    const now = new Date();
    // console.log(opportunities[0]);
    ret = lodash.filter(opportunities, function filter(o) {
      return (now >= o.startActive && now <= o.endActive);
    });
    return ret;
  },
  semesterOpportunities() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const opps = OpportunityInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }).fetch();
      opps.forEach((opp) => {
        const opportunity = Opportunities.findDoc(opp.opportunityID);
        opportunity.instanceID = opp.opportunityID;
        ret.push(opportunity);
      });
    }
    return ret;
  },
  opportunityICE(opportunityID) {
    const opp = OpportunityInstances.find({ opportunityID }).fetch();
    return opp[0].ice;
  },
  opportunityDescription(opportunityID) {
    const opp = OpportunityInstances.find({ opportunityID }).fetch();
    const opportunity = Opportunities.find({ _id: opp[0].opportunityID }).fetch();
    return opportunity[0].description;
  },
  courseICE(courseID) {
    const opp = CourseInstances.find({ courseID }).fetch();
    return opp[0].ice;
  },
  courseDescription(courseID) {
    const ci = CourseInstances.find({ courseID }).fetch();
    const course = Courses.find({ _id: ci[0].courseID }).fetch();
    return course[0].description;
  },
});

Template.Semester_List.events({
  'drop .bodyDrop'(event) {
    event.preventDefault();
    if (Template.instance().state.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const semesterId = Template.instance().state.get('semester')._id;
      const courses = CourseInstances.find({
        courseID: id,
        studentID: Meteor.userId(),
      }).fetch();
      if (courses.length > 0) {
        CourseInstances.updateSemester(courses[0]._id, semesterId);
        checkPrerequisites();
      } else {
        const opportunities = OpportunityInstances.find({
          studentID: Meteor.userId(),
          _id: id,
        }).fetch();
        if (opportunities.length > 0) {
          OpportunityInstances.updateSemester(opportunities[0]._id, semesterId)
        }
      }
    }
  },
  'click .item.addClass'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const courseSplit = event.target.text.split(' ');
    const courseSlug = `${courseSplit[0].toLowerCase()}${courseSplit[1]}`;
    const semester = template.state.get('semester');
    const semStr = Semesters.toString(semester._id, false);
    const semSplit = semStr.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Meteor.user().username;
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: event.target.text,
      grade: '***',
      student: username,
    };
    CourseInstances.define(ci);
    checkPrerequisites();
    Tracker.afterFlush(() => {
      template.$('.ui.icon.mini.button')
          .popup({
            on: 'click',
          });
      template.$('.item.course')
          .popup({
            inline: true,
            hoverable: true,
          });
      template.$('.item.opportunity')
          .popup({
            inline: false,
            hoverable: true,
            lastResort: 'right center',
            onShow: function resize() {
              resizePopup();
            },
          });
      template.$('.courseInstance').popup({
        inline: true, hoverable: true, position: 'top center',
        lastResort: 'right center',
        onShow: function resize() {
          resizePopup();
        },
      });
      template.$('.opportunityInstance').popup({
        inline: true, hoverable: true, position: 'top center',
        lastResort: 'right center',
        onShow: function resize() {
          resizePopup();
        },
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
            onShow: function resize() {
              resizePopup();
            },
          });
    });
  },
  'click .item.addOpportunity'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const name = event.target.text;
    const opportunity = Opportunities.find({ name }).fetch()[0];
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const semester = template.state.get('semester');
    const semStr = Semesters.toString(semester._id, false);
    const semSplit = semStr.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = Meteor.user().username;
    const oi = {
      semester: semSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    OpportunityInstances.define(oi);
  },

});

Template.Semester_List.onCreated(function semesterListOnCreate() {
  this.state = new ReactiveDict();
});

Template.Semester_List.onRendered(function semesterListOnRendered() {
  // console.log(this.data);
  if (this.data) {
    this.state.set('semester', this.data.semester);
    this.state.set('currentSemester', this.data.currentSemester);
  }
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.ui.icon.button')
        .popup({
          on: 'click',
          onShow: function resize() {
            resizePopup();
          },
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
          onShow: function resize() {
            resizePopup();
          },
        });
    template.$('.courseInstance').popup({
      inline: true, hoverable: true, position: 'top center',
      lastResort: 'right center',
      onShow: function resize() {
        resizePopup();
      },
    });
    template.$('.opportunityInstance').popup({
      inline: true, hoverable: true, position: 'top center',
      lastResort: 'right center',
      onShow: function resize() {
        resizePopup();
      },
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
          onShow: function resize() {
            resizePopup();
          },
        });
  });
});

Template.Semester_List.onDestroyed(function semesterListOnDestroyed() {
  // add your statement here
});

