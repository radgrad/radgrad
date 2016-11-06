import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';

/*               HELPER FUNCTIONS                             */

function addBodyClass() {
  $('body').addClass('radgrad-background-color');
  $('body').addClass('layout-body');
}

function removeBodyClass() {
  $('body').removeClass('radgrad-background-color');
  $('body').removeClass('layout-body');
}

/*                        ADMIN ROUTES                       */

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const adminHomePageRouteName = 'Admin_Home_Page';
adminRoutes.route('/', {
  name: adminHomePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: 'Admin_Home_Page' });
  },
});


/*                        ADVISOR ROUTES                       */

const advisorRoutes = FlowRouter.group({
  prefix: '/advisor',
  name: 'advisor',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const advisorStudentConfigurationPageRouteName = 'Advisor_Student_Configuration_Page';
advisorRoutes.route('/', {
  name: advisorStudentConfigurationPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Student_Configuration_Page' });
  },
});

export const advisorVerificationRequestsPendingPageRouteName = 'Advisor_Verification_Requests_Pending_Page';
advisorRoutes.route('/verification-requests', {
  name: advisorVerificationRequestsPendingPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Verification_Requests_Pending_Page' });
  },
});

export const advisorEventVerificationPageRouteName = 'Advisor_Event_Verification_Page';
advisorRoutes.route('/event-verification', {
  name: advisorEventVerificationPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Event_Verification_Page' });
  },
});

export const advisorCompletedVerificationsPageRouteName = 'Advisor_Completed_Verifications_Page';
advisorRoutes.route('/completed-verifications', {
  name: advisorCompletedVerificationsPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: 'Advisor_Completed_Verifications_Page' });
  },
});

/*                        FACULTY ROUTES                       */

const facultyRoutes = FlowRouter.group({
  prefix: '/faculty',
  name: 'faculty',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const facultyHomePageRouteName = 'Faculty_Home_Page';
facultyRoutes.route('/', {
  name: facultyHomePageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Faculty_Home_Page' });
  },
});

/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    BlazeLayout.render('Landing_Layout');
  },
});


/*                        MENTOR ROUTES                       */

const mentorRoutes = FlowRouter.group({
  prefix: '/mentor',
  name: 'mentor',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const mentorHomePageRouteName = 'Mentor_Home_Page';
mentorRoutes.route('/', {
  name: mentorHomePageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Mentor_Home_Page' });
  },
});

/*                        STUDENT ROUTES                       */

const studentRoutes = FlowRouter.group({
  prefix: '/student',
  name: 'student',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const studentHomePageRouteName = 'Student_Home_Page';
studentRoutes.route('/', {
  name: studentHomePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_Home_Page' });
  },
});

export const studentDegreePlannerPageRouteName = 'Student_Degree_Planner_Page';
studentRoutes.route('/degree-planner', {
  name: studentDegreePlannerPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_Degree_Planner_Page' });
  },
});

export const studentMentorSpacePageRouteName = 'Student_MentorSpace_Page';
studentRoutes.route('/mentorspace', {
  name: studentMentorSpacePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_MentorSpace_Page' });
  },
});

export const studentExplorerPageRouteName = 'Student_Explorer_Page';
studentRoutes.route('/explorer', {
  name: studentExplorerPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Student_Explorer_Page' });
  },
});

/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
