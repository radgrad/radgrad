import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'Landing_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Landing_Page' });
  },
});

FlowRouter.route('/admin-home-page', {
  name: 'Admin_Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Admin_Home_Page' });
  },
});

FlowRouter.route('/advisor-home-page', {
  name: 'Advisor_Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Advisor_Home_Page' });
  },
});

FlowRouter.route('/mentor-home-page', {
  name: 'Mentor_Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Mentor_Home_Page' });
  },
});


FlowRouter.route('/student-home-page', {
  name: 'Student_Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Student_Home_Page' });
  },
});

FlowRouter.route('/student-degree-planner-page', {
  name: 'Student_Degree_Planner_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Student_Degree_Planner_Page' });
  },
});

FlowRouter.route('/student-mentorspace-page', {
  name: 'Student_MentorSpace_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Student_MentorSpace_Page' });
  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_Body', { main: 'App_Not_Found' });
  },
};
