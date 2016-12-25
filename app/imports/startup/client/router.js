import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';

/** Design notes:
 * Only one group per role. (Used to extract role from path.)
 * Every group has a home page called 'home'.  (Used for redirect from landing.)
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
const studentRoutes = FlowRouter.group({
  prefix: '/student/:username',
  name: 'student',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const studentHomePageRouteName = 'Student_Home_Page';
studentRoutes.route('/home', {
  name: studentHomePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageRouteName });
  },
});

export const studentHomePageAboutMeRouteName = 'Student_AboutMe';
studentRoutes.route('/home/aboutme', {
  name: studentHomePageAboutMeRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageAboutMeRouteName });
  },
});

export const studentHomePageLevelsRouteName = 'Student_Levels';
studentRoutes.route('/home/levels', {
  name: studentHomePageLevelsRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageLevelsRouteName });
  },
});

export const studentHomePageIceRouteName = 'Student_Ice';
studentRoutes.route('/home/ice', {
  name: studentHomePageIceRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageIceRouteName });
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

export const studentExplorerDegreePageRouteName = 'Student_Explorer_Degree_Page';
studentRoutes.route('/explorer/degree', {
  name: studentExplorerDegreePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerDegreePageRouteName });
  },
});

export const studentExplorerCoursePageRouteName = 'Student_Explorer_Course_Page';
studentRoutes.route('/explorer/course', {
  name: studentExplorerCoursePageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerCoursePageRouteName });
  },
});

export const studentExplorerInterestPageRouteName = 'Student_Explorer_Interest_Page';
studentRoutes.route('/explorer/interest', {
  name: studentExplorerInterestPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerInterestPageRouteName });
  },
});

export const studentExplorerOpportunityPageRouteName = 'Student_Explorer_Opportunity_Page';
studentRoutes.route('/explorer/opportunity', {
  name: studentExplorerOpportunityPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerOpportunityPageRouteName });
  },
});

export const studentExplorerCareerPageRouteName = 'Student_Explorer_Career_Page';
studentRoutes.route('/explorer/career', {
  name: studentExplorerCareerPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerCareerPageRouteName });
  },
});

export const studentExplorerInterestAlgorithmsPageRouteName = 'Algorithms';
studentRoutes.route('/explorer/interest/algorithms', {
  name: studentExplorerInterestAlgorithmsPageRouteName,
  action() {
    BlazeLayout.render('Student_Layout', { main: studentExplorerInterestAlgorithmsPageRouteName });
  },
});

/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
