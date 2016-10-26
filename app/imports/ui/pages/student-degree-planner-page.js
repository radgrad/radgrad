import { Template } from 'meteor/templating';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { Users } from '../../api/user/UserCollection.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Student_Degree_Planner_Page.onCreated(function appBodyOnCreated() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Student_Degree_Planner_Page.helpers({
  academicYearArgs(year) {
    Template.instance().state.set('fallYear', year);
    Template.instance().state.set('springYear', year + 1);
    return {
      fallYear: year,
      springYear: year + 1,
      studentUsername: 'alfredpersona',
      dict: Template.instance().state,
    };
  },
});

Template.Student_Degree_Planner_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});
