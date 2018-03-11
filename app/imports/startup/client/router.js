import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { appLog } from '../../api/log/AppLogCollection';
import { userInteractionDefineMethod } from '../../api/log/UserInteractionCollection.methods';
import { ROLE } from '../../api/role/Role';

/*
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

// This creates a UserInteraction document referencing the page visited by user
// Currently only used for student routes
function trackPath() {
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.STUDENT])) {
    const userID = Meteor.userId();
    const type = 'pageView';
    const path = FlowRouter.current().path;
    const typeData = path.substr(path.indexOf('/', 9) + 1);
    userInteractionDefineMethod.call({ userID, type, typeData }, (error) => {
      if (error) {
        console.log('Error creating UserInteraction.', error);
      }
    });
  }
}

/*                        APP LOGGING                        */


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
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminHomePageRouteName });
  },
});

export const adminDataModelPageRouteName = 'Admin_DataModel_Page';
adminRoutes.route('/datamodel', {
  name: adminDataModelPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelPageRouteName });
  },
});

export const adminDataModelCareerGoalsPageRouteName = 'Admin_DataModel_CareerGoals_Page';
adminRoutes.route('/datamodel/career-goals', {
  name: adminDataModelCareerGoalsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCareerGoalsPageRouteName });
  },
});

export const adminDataModelCourseInstancesPageRouteName = 'Admin_DataModel_Course_Instances_Page';
adminRoutes.route('/datamodel/course-instances', {
  name: adminDataModelCourseInstancesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCourseInstancesPageRouteName });
  },
});

export const adminDataModelCoursesPageRouteName = 'Admin_DataModel_Courses_Page';
adminRoutes.route('/datamodel/courses', {
  name: adminDataModelCoursesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCoursesPageRouteName });
  },
});

export const adminDataModelHelpMessagesPageRouteName = 'Admin_DataModel_HelpMessages_Page';
adminRoutes.route('/datamodel/help-messages', {
  name: adminDataModelHelpMessagesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelHelpMessagesPageRouteName });
  },
});

export const adminDataModelInterestsPageRouteName = 'Admin_DataModel_Interests_Page';
adminRoutes.route('/datamodel/interests', {
  name: adminDataModelInterestsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelInterestsPageRouteName });
  },
});

export const adminDataModelOpportunitiesPageRouteName = 'Admin_DataModel_Opportunities_Page';
adminRoutes.route('/datamodel/opportunities', {
  name: adminDataModelOpportunitiesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunitiesPageRouteName });
  },
});

export const adminDataModelOpportunityInstancesPageRouteName = 'Admin_DataModel_Opportunity_Instances_Page';
adminRoutes.route('/datamodel/opportunity-instances', {
  name: adminDataModelOpportunityInstancesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunityInstancesPageRouteName });
  },
});

export const adminDataModelReviewsPageRouteName = 'Admin_DataModel_Reviews_Page';
adminRoutes.route('/datamodel/reviews', {
  name: adminDataModelReviewsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelReviewsPageRouteName });
  },
});

export const adminDataModelTeasersPageRouteName = 'Admin_DataModel_Teasers_Page';
adminRoutes.route('/datamodel/teasers', {
  name: adminDataModelTeasersPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelTeasersPageRouteName });
  },
});

export const adminDataModelUsersPageRouteName = 'Admin_DataModel_Users_Page';
adminRoutes.route('/datamodel/users', {
  name: adminDataModelUsersPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataModelUsersPageRouteName });
  },
});

export const adminDataBasePageRouteName = 'Admin_DataBase_Page';
adminRoutes.route('/database', {
  name: adminDataBasePageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataBasePageRouteName });
  },
});

export const adminDataBaseIntegrityCheckPageRouteName = 'Admin_DataBase_Integrity_Check_Page';
adminRoutes.route('/database/integrity-check', {
  name: adminDataBaseIntegrityCheckPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataBaseIntegrityCheckPageRouteName });
  },
});

export const adminDataBaseDumpPageRouteName = 'Admin_DataBase_Dump_Page';
adminRoutes.route('/database/dump', {
  name: adminDataBaseDumpPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminDataBaseDumpPageRouteName });
  },
});

export const adminModerationPageRouteName = 'Admin_Moderation_Page';
adminRoutes.route('/moderation', {
  name: adminModerationPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminModerationPageRouteName });
  },
});


export const adminAnalyticsHomePageRouteName = 'Admin_Analytics_Home_Page';
adminRoutes.route('/analytics', {
  name: adminAnalyticsHomePageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsHomePageRouteName });
  },
});

export const adminCourseScoreboardPageRouteName = 'Admin_Course_Scoreboard_Page';
adminRoutes.route('/course-scoreboard', {
  name: adminCourseScoreboardPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Admin_Layout', { main: adminCourseScoreboardPageRouteName });
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
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorStudentConfigurationPageRouteName });
  },
});

export const advisorVerificationRequestsPendingPageRouteName = 'Advisor_Verification_Requests_Pending_Page';
advisorRoutes.route('/verification-requests', {
  name: advisorVerificationRequestsPendingPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorVerificationRequestsPendingPageRouteName });
  },
});

export const advisorEventVerificationPageRouteName = 'Advisor_Event_Verification_Page';
advisorRoutes.route('/event-verification', {
  name: advisorEventVerificationPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorEventVerificationPageRouteName });
  },
});

export const advisorCompletedVerificationsPageRouteName = 'Advisor_Completed_Verifications_Page';
advisorRoutes.route('/completed-verifications', {
  name: advisorCompletedVerificationsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorCompletedVerificationsPageRouteName });
  },
});

export const advisorModerationPageRouteName = 'Advisor_Moderation_Page';
advisorRoutes.route('/moderation', {
  name: advisorModerationPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorModerationPageRouteName });
  },
});

export const advisorAcademicPlanPageRouteName = 'Advisor_Academic_Plan_Page';
advisorRoutes.route('/academic-plan', {
  name: advisorAcademicPlanPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorAcademicPlanPageRouteName });
  },
});

export const advisorCourseScoreboardPageRouteName = 'Advisor_Course_Scoreboard_Page';
advisorRoutes.route('/course-scoreboard', {
  name: advisorCourseScoreboardPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Advisor_Layout', { main: advisorCourseScoreboardPageRouteName });
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
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyHomePageRouteName });
  },
});

export const facultyExplorerPageRouteName = 'Faculty_Explorer_Page';
facultyRoutes.route('/explorer', {
  name: facultyExplorerPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerPageRouteName });
  },
});

export const facultyExplorerCareerGoalsPageRouteName = 'Faculty_Explorer_CareerGoals_Page';
facultyRoutes.route('/explorer/career-goals/:careerGoal', {
  name: facultyExplorerCareerGoalsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerCareerGoalsPageRouteName });
  },
});

export const facultyExplorerCoursesPageRouteName = 'Faculty_Explorer_Courses_Page';
facultyRoutes.route('/explorer/courses/:course', {
  name: facultyExplorerCoursesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerCoursesPageRouteName });
  },
});

export const facultyExplorerDegreesPageRouteName = 'Faculty_Explorer_Degrees_Page';
facultyRoutes.route('/explorer/degrees/:degree', {
  name: facultyExplorerDegreesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerDegreesPageRouteName });
  },
});

export const facultyExplorerPlansPageRouteName = 'Faculty_Explorer_Plans_Page';
facultyRoutes.route('/explorer/plans/:plan', {
  name: facultyExplorerPlansPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerPlansPageRouteName });
  },
});

export const facultyExplorerInterestsPageRouteName = 'Faculty_Explorer_Interests_Page';
facultyRoutes.route('/explorer/interests/:interest', {
  name: facultyExplorerInterestsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerInterestsPageRouteName });
  },
});

export const facultyExplorerOpportunitiesPageRouteName = 'Faculty_Explorer_Opportunities_Page';
facultyRoutes.route('/explorer/opportunities/:opportunity', {
  name: facultyExplorerOpportunitiesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerOpportunitiesPageRouteName });
  },
});

export const facultyExplorerUsersPageRouteName = 'Faculty_Explorer_Users_Page';
facultyRoutes.route('/explorer/users/:explorerUserName', {
  name: facultyExplorerUsersPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyExplorerUsersPageRouteName });
  },
});

export const facultyVerificationPageRouteName = 'Faculty_Verification_Page';
facultyRoutes.route('/verification', {
  name: facultyVerificationPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyVerificationPageRouteName });
  },
});

export const facultyVerificationCompletedPageRouteName = 'Faculty_Verification_Completed_Page';
facultyRoutes.route('/verification-completed', {
  name: facultyVerificationCompletedPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyVerificationCompletedPageRouteName });
  },
});

export const facultyManageOpportunitiesPageRouteName = 'Faculty_Manage_Opportunities_Page';
facultyRoutes.route('/manage-opportunities', {
  name: facultyManageOpportunitiesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyManageOpportunitiesPageRouteName });
  },
});

export const facultyCourseScoreboardPageRouteName = 'Course_Scoreboard_Page';
facultyRoutes.route('/course-scoreboard', {
  name: facultyCourseScoreboardPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Faculty_Layout', { main: facultyCourseScoreboardPageRouteName });
  },
});

/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path} ${landingPageRouteName}`);
    BlazeLayout.render('Landing_Layout');
  },
});

export const landingExplorerPageRouteName = 'Landing_Explorer_Page';
FlowRouter.route('/explorer', {
  name: landingExplorerPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerPageRouteName });
  },
});

export const landingExplorerCareerGoalsPageRouteName = 'Landing_Explorer_CareerGoals_Page';
FlowRouter.route('/explorer/career-goals/:careerGoal', {
  name: landingExplorerCareerGoalsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerCareerGoalsPageRouteName });
  },
});

export const landingExplorerCoursesPageRouteName = 'Landing_Explorer_Courses_Page';
FlowRouter.route('/explorer/courses/:course', {
  name: landingExplorerCoursesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerCoursesPageRouteName });
  },
});

export const landingExplorerDegreesPageRouteName = 'Landing_Explorer_Degrees_Page';
FlowRouter.route('/explorer/degrees/:degree', {
  name: landingExplorerDegreesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerDegreesPageRouteName });
  },
});

export const landingExplorerPlansPageRouteName = 'Landing_Explorer_Plans_Page';
FlowRouter.route('/explorer/plans/:plan', {
  name: landingExplorerPlansPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerPlansPageRouteName });
  },
});

export const landingExplorerInterestsPageRouteName = 'Landing_Explorer_Interests_Page';
FlowRouter.route('/explorer/interests/:interest', {
  name: landingExplorerInterestsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerInterestsPageRouteName });
  },
});

export const landingExplorerOpportunitiesPageRouteName = 'Landing_Explorer_Opportunities_Page';
FlowRouter.route('/explorer/opportunities/:opportunity', {
  name: landingExplorerOpportunitiesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerOpportunitiesPageRouteName });
  },
});


/*                        GUIDED TOUR ROUTE                       */

function scrollTop() {
  this.window.scrollTo(0, 0);
}

function addGuidedTourBodyClass() {
  $('body').addClass('guided-tour-background');
}

function removeGuidedTourBodyClass() {
  $('body').removeClass('guided-tour-background');
}

export const studentGuidedTourPageRouteName = 'Student_Guided_Tour_Page';
FlowRouter.route('/guidedtour/student', {
  name: studentGuidedTourPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Guided_Tour_Layout', { main: studentGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const advisorGuidedTourPageRouteName = 'Advisor_Guided_Tour_Page';
FlowRouter.route('/guidedtour/advisor', {
  name: advisorGuidedTourPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Guided_Tour_Layout', { main: advisorGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const facultyGuidedTourPageRouteName = 'Faculty_Guided_Tour_Page';
FlowRouter.route('/guidedtour/faculty', {
  name: facultyGuidedTourPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Guided_Tour_Layout', { main: facultyGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const mentorGuidedTourPageRouteName = 'Mentor_Guided_Tour_Page';
FlowRouter.route('/guidedtour/mentor', {
  name: mentorGuidedTourPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Guided_Tour_Layout', { main: mentorGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
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
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorHomePageRouteName });
  },
});

export const mentorExplorerPageRouteName = 'Mentor_Explorer_Page';
mentorRoutes.route('/explorer', {
  name: mentorExplorerPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerPageRouteName });
  },
});

export const mentorExplorerCareerGoalsPageRouteName = 'Mentor_Explorer_CareerGoals_Page';
mentorRoutes.route('/explorer/career-goals/:careerGoal', {
  name: mentorExplorerCareerGoalsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerCareerGoalsPageRouteName });
  },
});

export const mentorExplorerCoursesPageRouteName = 'Mentor_Explorer_Courses_Page';
mentorRoutes.route('/explorer/courses/:course', {
  name: mentorExplorerCoursesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerCoursesPageRouteName });
  },
});

export const mentorExplorerPlansPageRouteName = 'Mentor_Explorer_Plans_Page';
mentorRoutes.route('/explorer/plans/:plan', {
  name: mentorExplorerPlansPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerPlansPageRouteName });
  },
});

export const mentorExplorerDegreesPageRouteName = 'Mentor_Explorer_Degrees_Page';
mentorRoutes.route('/explorer/degrees/:degree', {
  name: mentorExplorerDegreesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerDegreesPageRouteName });
  },
});

export const mentorExplorerInterestsPageRouteName = 'Mentor_Explorer_Interests_Page';
mentorRoutes.route('/explorer/interests/:interest', {
  name: mentorExplorerInterestsPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerInterestsPageRouteName });
  },
});

export const mentorExplorerOpportunitiesPageRouteName = 'Mentor_Explorer_Opportunities_Page';
mentorRoutes.route('/explorer/opportunities/:opportunity', {
  name: mentorExplorerOpportunitiesPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerOpportunitiesPageRouteName });
  },
});

export const mentorExplorerUsersPageRouteName = 'Mentor_Explorer_Users_Page';
mentorRoutes.route('/explorer/users/:explorerUserName', {
  name: mentorExplorerUsersPageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorExplorerUsersPageRouteName });
  },
});

export const mentorMentorSpacePageRouteName = 'Mentor_MentorSpace_Page';
mentorRoutes.route('/mentor-space', {
  name: mentorMentorSpacePageRouteName,
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Mentor_Layout', { main: mentorMentorSpacePageRouteName });
  },
});

/*                        STUDENT ROUTES                       */

// Please don't make subgroups of this group. I use the group name to help with authorization.
// Student pages will automatically go to top when rendered. This helps when navigating the long left
// side menu in the explorer pages.
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
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerCareerGoalsPageRouteName });
  },
});

export const studentExplorerCoursesPageRouteName = 'Student_Explorer_Courses_Page';
studentRoutes.route('/explorer/courses/:course', {
  name: studentExplorerCoursesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerCoursesPageRouteName });
  },
});

export const studentExplorerDegreesPageRouteName = 'Student_Explorer_Degrees_Page';
studentRoutes.route('/explorer/degrees/:degree', {
  name: studentExplorerDegreesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerDegreesPageRouteName });
  },
});

export const studentExplorerPlansPageRouteName = 'Student_Explorer_Plans_Page';
studentRoutes.route('/explorer/plans/:plan', {
  name: studentExplorerPlansPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerPlansPageRouteName });
  },
});

export const studentExplorerInterestsPageRouteName = 'Student_Explorer_Interests_Page';
studentRoutes.route('/explorer/interests/:interest', {
  name: studentExplorerInterestsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerInterestsPageRouteName });
  },
});

export const studentExplorerOpportunitiesPageRouteName = 'Student_Explorer_Opportunities_Page';
studentRoutes.route('/explorer/opportunities/:opportunity', {
  name: studentExplorerOpportunitiesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerOpportunitiesPageRouteName });
  },
});

export const studentExplorerUsersPageRouteName = 'Student_Explorer_Users_Page';
studentRoutes.route('/explorer/users/:explorerUserName', {
  name: studentExplorerUsersPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerUsersPageRouteName });
  },
});

export const studentHomePageRouteName = 'Student_Home_Page';
studentRoutes.route('/home', {
  name: studentHomePageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentHomePageRouteName });
  },
});

export const studentHomeAboutMePageRouteName = 'Student_Home_AboutMe_Page';
studentRoutes.route('/home/aboutme', {
  name: studentHomeAboutMePageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentHomeAboutMePageRouteName });
  },
});

export const studentHomeLogPageRouteName = 'Student_Home_Log_Page';
studentRoutes.route('/home/log', {
  name: studentHomeLogPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentHomeLogPageRouteName });
  },
});

export const studentHomeLevelsPageRouteName = 'Student_Home_Levels_Page';
studentRoutes.route('/home/levels', {
  name: studentHomeLevelsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentHomeLevelsPageRouteName });
  },
});

export const studentHomeIcePageRouteName = 'Student_Home_Ice_Page';
studentRoutes.route('/home/ice', {
  name: studentHomeIcePageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentHomeIcePageRouteName });
  },
});

export const studentDegreePlannerPageRouteName = 'Student_Degree_Planner_Page';
studentRoutes.route('/degree-planner', {
  name: studentDegreePlannerPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentDegreePlannerPageRouteName });
  },
});

export const studentMentorSpacePageRouteName = 'Student_MentorSpace_Page';
studentRoutes.route('/mentor-space', {
  name: studentMentorSpacePageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentMentorSpacePageRouteName });
  },
});

export const studentExplorerPageRouteName = 'Student_Explorer_Page';
studentRoutes.route('/explorer', {
  name: studentExplorerPageRouteName,
  triggersEnter: [trackPath],
  action() {
    appLog.info(`${FlowRouter.current().path}`);
    BlazeLayout.render('Student_Layout', { main: studentExplorerPageRouteName });
  },
});

/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    appLog.info(`${FlowRouter.current().path} Page not found`);
    BlazeLayout.render('Page_Not_Found');
  },
};


/*                     LIST OF ALL DEFINED ROUTE NAMES     */
export const routeNames = _.sortBy(_.map(adminRoutes._router._routes, route => route.name));
