import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';


/**
 * Design notes:
 * Only one group per role. (Used to extract role from path.)
 * Every group must have a home page called 'home'.  (Used for redirect from landing.)
 */

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

// Please don't make subgroups of this group. I use the group name to help with authorization.
const adminRoutes = FlowRouter.group({
  prefix: '/admin/:username',
  name: 'admin',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const adminHomePageRouteName = 'Admin_Home_Page';
adminRoutes.route('/home', {
  name: adminHomePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminHomePageRouteName });
  },
});

export const adminDataModelPageRouteName = 'Admin_DataModel_Page';
adminRoutes.route('/datamodel', {
  name: adminDataModelPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelPageRouteName });
  },
});

export const adminDataModelCareerGoalsPageRouteName = 'Admin_DataModel_CareerGoals_Page';
adminRoutes.route('/datamodel/career-goals', {
  name: adminDataModelCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCareerGoalsPageRouteName });
  },
});

export const adminDataModelCoursesPageRouteName = 'Admin_DataModel_Courses_Page';
adminRoutes.route('/datamodel/courses', {
  name: adminDataModelCoursesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCoursesPageRouteName });
  },
});

export const adminDataModelHelpMessagesPageRouteName = 'Admin_DataModel_HelpMessages_Page';
adminRoutes.route('/datamodel/help-messages', {
  name: adminDataModelHelpMessagesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelHelpMessagesPageRouteName });
  },
});

export const adminDataModelInterestsPageRouteName = 'Admin_DataModel_Interests_Page';
adminRoutes.route('/datamodel/interests', {
  name: adminDataModelInterestsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelInterestsPageRouteName });
  },
});

export const adminDataModelOpportunitiesPageRouteName = 'Admin_DataModel_Opportunities_Page';
adminRoutes.route('/datamodel/opportunities', {
  name: adminDataModelOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunitiesPageRouteName });
  },
});

export const adminDataModelReviewsPageRouteName = 'Admin_DataModel_Reviews_Page';
adminRoutes.route('/datamodel/reviews', {
  name: adminDataModelReviewsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelReviewsPageRouteName });
  },
});

export const adminDataModelTeasersPageRouteName = 'Admin_DataModel_Teasers_Page';
adminRoutes.route('/datamodel/teasers', {
  name: adminDataModelTeasersPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelTeasersPageRouteName });
  },
});

export const adminDataModelUsersPageRouteName = 'Admin_DataModel_Users_Page';
adminRoutes.route('/datamodel/users', {
  name: adminDataModelUsersPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelUsersPageRouteName });
  },
});

export const adminDataBasePageRouteName = 'Admin_DataBase_Page';
adminRoutes.route('/database', {
  name: adminDataBasePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataBasePageRouteName });
  },
});

export const adminDataBaseIntegrityCheckPageRouteName = 'Admin_DataBase_Integrity_Check_Page';
adminRoutes.route('/database/integrity-check', {
  name: adminDataBaseIntegrityCheckPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataBaseIntegrityCheckPageRouteName });
  },
});

export const adminDataBaseDumpPageRouteName = 'Admin_DataBase_Dump_Page';
adminRoutes.route('/database/dump', {
  name: adminDataBaseDumpPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataBaseDumpPageRouteName });
  },
});

export const adminDataBaseRestorePageRouteName = 'Admin_DataBase_Restore_Page';
adminRoutes.route('/database/restore', {
  name: adminDataBaseRestorePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataBaseRestorePageRouteName });
  },
});

/*                        ADVISOR ROUTES                       */

// Please don't make subgroups of this group. I use the group name to help with authorization.
const advisorRoutes = FlowRouter.group({
  prefix: '/advisor/:username',
  name: 'advisor',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const advisorStudentConfigurationPageRouteName = 'Advisor_Student_Configuration_Page';
advisorRoutes.route('/home', {
  name: advisorStudentConfigurationPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorStudentConfigurationPageRouteName });
  },
});

export const advisorVerificationRequestsPendingPageRouteName = 'Advisor_Verification_Requests_Pending_Page';
advisorRoutes.route('/verification-requests', {
  name: advisorVerificationRequestsPendingPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorVerificationRequestsPendingPageRouteName });
  },
});

export const advisorEventVerificationPageRouteName = 'Advisor_Event_Verification_Page';
advisorRoutes.route('/event-verification', {
  name: advisorEventVerificationPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorEventVerificationPageRouteName });
  },
});

export const advisorCompletedVerificationsPageRouteName = 'Advisor_Completed_Verifications_Page';
advisorRoutes.route('/completed-verifications', {
  name: advisorCompletedVerificationsPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorCompletedVerificationsPageRouteName });
  },
});

/*                        FACULTY ROUTES                       */

// Please don't make subgroups of this group. I use the group name to help with authorization.
const facultyRoutes = FlowRouter.group({
  prefix: '/faculty/:username',
  name: 'faculty',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const facultyHomePageRouteName = 'Faculty_Home_Page';
facultyRoutes.route('/home', {
  name: facultyHomePageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: facultyHomePageRouteName });
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

// Please don't make subgroups of this group. I use the group name to help with authorization.
const mentorRoutes = FlowRouter.group({
  prefix: '/mentor/:username',
  name: 'mentor',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const mentorHomePageRouteName = 'Mentor_Home_Page';
mentorRoutes.route('/home', {
  name: mentorHomePageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: mentorHomePageRouteName });
  },
});

/*                        STUDENT ROUTES                       */

// Please don't make subgroups of this group. I use the group name to help with authorization.
// Student pages will automatically go to top when rendered.
const studentRoutes = FlowRouter.group({
  prefix: '/student/:username',
  name: 'student',
  triggersEnter: [addBodyClass, function () {
    this.window.scrollTo(0, 0);
  }],
  triggersExit: [removeBodyClass],
});

export const studentExplorerCareerGoalsPageRouteName = 'Student_Explorer_CareerGoals_Page';
studentRoutes.route('/explorer/career-goals/:careerGoal', {
  name: studentExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerCareerGoalsPageRouteName });
  },
});

export const studentExplorerCoursesPageRouteName = 'Student_Explorer_Courses_Page';
studentRoutes.route('/explorer/courses/:course', {
  name: studentExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerCoursesPageRouteName });
  },
});

export const studentExplorerDegreesPageRouteName = 'Student_Explorer_Degrees_Page';
studentRoutes.route('/explorer/degrees/:degree', {
  name: studentExplorerDegreesPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerDegreesPageRouteName });
  },
});

export const studentExplorerInterestsPageRouteName = 'Student_Explorer_Interests_Page';
studentRoutes.route('/explorer/interests/:interest', {
  name: studentExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerInterestsPageRouteName });
  },
});

export const studentExplorerOpportunitiesPageRouteName = 'Student_Explorer_Opportunities_Page';
studentRoutes.route('/explorer/opportunities/:opportunity', {
  name: studentExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerOpportunitiesPageRouteName });
  },
});

export const studentExplorerUsersPageRouteName = 'Student_Explorer_Users_Page';
studentRoutes.route('/explorer/users/', {
  name: studentExplorerUsersPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerUsersPageRouteName });
  },
});

export const studentHomePageRouteName = 'Student_Home_Page';
studentRoutes.route('/home', {
  name: studentHomePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageRouteName });
  },
});

export const studentHomeAboutMePageRouteName = 'Student_Home_AboutMe_Page';
studentRoutes.route('/home/aboutme', {
  name: studentHomeAboutMePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeAboutMePageRouteName });
  },
});

export const studentHomeLevelsPageRouteName = 'Student_Home_Levels_Page';
studentRoutes.route('/home/levels', {
  name: studentHomeLevelsPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeLevelsPageRouteName });
  },
});

export const studentHomeIcePageRouteName = 'Student_Home_Ice_Page';
studentRoutes.route('/home/ice', {
  name: studentHomeIcePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeIcePageRouteName });
  },
});

export const studentHomePageAboutIceRouteName = 'Student_About_Ice';
studentRoutes.route('/home/about-ice', {
  name: studentHomePageAboutIceRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageAboutIceRouteName });
  },
});

export const studentHomePageAboutLevelsRouteName = 'Student_About_Levels';
studentRoutes.route('/home/about-levels', {
  name: studentHomePageAboutLevelsRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageAboutLevelsRouteName });
  },
});

export const studentDegreePlannerPageRouteName = 'Student_Degree_Planner_Page';
studentRoutes.route('/degree-planner', {
  name: studentDegreePlannerPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentDegreePlannerPageRouteName });
  },
});

export const studentMentorSpacePageRouteName = 'Student_MentorSpace_Page';
studentRoutes.route('/mentor-space', {
  name: studentMentorSpacePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentMentorSpacePageRouteName });
  },
});

export const studentExplorerPageRouteName = 'Student_Explorer_Page';
studentRoutes.route('/explorer', {
  name: studentExplorerPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerPageRouteName });
  },
});

/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};


/*                     LIST OF ALL DEFINED ROUTE NAMES     */
export const routeNames = _.sortBy(_.map(adminRoutes._router._routes, route => route.name));
