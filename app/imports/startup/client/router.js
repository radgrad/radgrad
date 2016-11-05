import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'Landing_Page',
  action() {
    BlazeLayout.render('Landing_Layout');
  },
});

/*
FlowRouter.route('/admin-home-page', {
  name: 'Admin_Home_Page',
  action() {
    BlazeLayout.render('Admin_Layout', { main: 'Admin_Home_Page' });
  },
});
*/

FlowRouter.route('/advisor-home-page', {
  name: 'Advisor_Home_Page',
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Home_Page' });
  },
  triggersEnter: [function addBodyClass() {
    $('body').addClass('radgrad-background-color');
    $('body').addClass('layout-body');
  }],
  triggersExit: [function removeBodyClass() {
    $('body').removeClass('radgrad-background-color');
    $('body').removeClass('layout-body');
  }],
});

FlowRouter.route('/mentor-home-page', {
  name: 'Mentor_Home_Page',
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Mentor_Home_Page' });
  },
});


FlowRouter.route('/student-home-page', {
  name: 'Student_Home_Page',
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_Home_Page' });
  },
});

FlowRouter.route('/student-degree-planner-page', {
  name: 'Student_Degree_Planner_Page',
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_Degree_Planner_Page' });
  },
});

FlowRouter.route('/student-mentorspace-page', {
  name: 'Student_MentorSpace_Page',
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_MentorSpace_Page' });
  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
