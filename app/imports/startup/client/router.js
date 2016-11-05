import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';

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

const advisorRoutes = FlowRouter.group({
  prefix: '/advisor',
  name: 'advisor',
  triggersEnter: [function addBodyClass() {
    $('body').addClass('radgrad-background-color');
    $('body').addClass('layout-body');
  }],
  triggersExit: [function removeBodyClass() {
    $('body').removeClass('radgrad-background-color');
    $('body').removeClass('layout-body');
  }]
});

advisorRoutes.route('/student-configuration', {
  name: 'Advisor_Student_Configuration_Page',
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Student_Configuration_Page' });
  },
});

advisorRoutes.route('/verification-requests', {
  name: 'Advisor_Verification_Requests_Pending_Page',
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Verification_Requests_Pending_Page' });
  },
});

advisorRoutes.route('/event-verification', {
  name: 'Advisor_Event_Verification_Page',
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Event_Verification_Page' });
  },
});

advisorRoutes.route('/completed-verifications', {
  name: 'Advisor_Completed_Verifications_Page',
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Completed_Verifications_Page' });
  },
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
