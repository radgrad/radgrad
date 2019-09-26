import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';
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
    const path = FlowRouter.current().path;
    const username = Meteor.user('username').username;
    const type = 'pageView';
    const typeData = path.substr(path.indexOf('/', 9) + 1);
    const interactionData = { username, type, typeData };
    userInteractionDefineMethod.call(interactionData, (error) => {
      if (error) {
        console.log('Error creating UserInteraction.', error);
      }
    });
  }
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

export const adminDataModelAcademicPlansPageRouteName = 'Admin_DataModel_AcademicPlans_Page';
adminRoutes.route('/datamodel/academic-plans', {
  name: adminDataModelAcademicPlansPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelAcademicPlansPageRouteName });
  },
});

export const adminDataModelAcademicYearInstancesPageRouteName = 'Admin_DataModel_Academic_Year_Instances_Page';
adminRoutes.route('/datamodel/academic-year-instances', {
  name: adminDataModelAcademicYearInstancesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelAcademicYearInstancesPageRouteName });
  },
});

export const adminDataModelAdvisorLogsPageRouteName = 'Admin_DataModel_Advisor_Logs_Page';
adminRoutes.route('/datamodel/advisor-logs', {
  name: adminDataModelAdvisorLogsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelAdvisorLogsPageRouteName });
  },
});

export const adminDataModelCareerGoalsPageRouteName = 'Admin_DataModel_CareerGoals_Page';
adminRoutes.route('/datamodel/career-goals', {
  name: adminDataModelCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCareerGoalsPageRouteName });
  },
});

export const adminDataModelCourseInstancesPageRouteName = 'Admin_DataModel_Course_Instances_Page';
adminRoutes.route('/datamodel/course-instances', {
  name: adminDataModelCourseInstancesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCourseInstancesPageRouteName });
  },
});

export const adminDataModelCoursesPageRouteName = 'Admin_DataModel_Courses_Page';
adminRoutes.route('/datamodel/courses', {
  name: adminDataModelCoursesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelCoursesPageRouteName });
  },
});

export const adminDataModelDesiredDegreesPageRouteName = 'Admin_DataModel_DesiredDegrees_Page';
adminRoutes.route('/datamodel/desired-degrees', {
  name: adminDataModelDesiredDegreesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelDesiredDegreesPageRouteName });
  },
});

export const adminDataModelFeedsPageRouteName = 'Admin_DataModel_Feeds_Page';
adminRoutes.route('/datamodel/feeds', {
  name: adminDataModelFeedsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelFeedsPageRouteName });
  },
});

export const adminDataModelFeedbackInstancesPageRouteName = 'Admin_DataModel_Feedback_Instances_Page';
adminRoutes.route('/datamodel/feedback-instances', {
  name: adminDataModelFeedbackInstancesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelFeedbackInstancesPageRouteName });
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

export const adminDataModelInterestTypesPageRouteName = 'Admin_DataModel_Interest_Types_Page';
adminRoutes.route('/datamodel/interest-types', {
  name: adminDataModelInterestTypesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelInterestTypesPageRouteName });
  },
});

export const adminDataModelMentorAnswersPageRouteName = 'Admin_DataModel_Mentor_Answers_Page';
adminRoutes.route('/datamodel/mentor-answers', {
  name: adminDataModelMentorAnswersPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelMentorAnswersPageRouteName });
  },
});

export const adminDataModelMentorQuestionsPageRouteName = 'Admin_DataModel_Mentor_Questions_Page';
adminRoutes.route('/datamodel/mentor-questions', {
  name: adminDataModelMentorQuestionsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelMentorQuestionsPageRouteName });
  },
});


export const adminDataModelOpportunitiesPageRouteName = 'Admin_DataModel_Opportunities_Page';
adminRoutes.route('/datamodel/opportunities', {
  name: adminDataModelOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunitiesPageRouteName });
  },
});

export const adminDataModelOpportunityInstancesPageRouteName = 'Admin_DataModel_Opportunity_Instances_Page';
adminRoutes.route('/datamodel/opportunity-instances', {
  name: adminDataModelOpportunityInstancesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunityInstancesPageRouteName });
  },
});

export const adminDataModelOpportunityTypesPageRouteName = 'Admin_DataModel_Opportunity_Types_Page';
adminRoutes.route('/datamodel/opportunity-types', {
  name: adminDataModelOpportunityTypesPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelOpportunityTypesPageRouteName });
  },
});

export const adminDataModelPlanChoicePageRouteName = 'Admin_DataModel_Plan_Choice_Page';
adminRoutes.route('/datamodel/plan-choices', {
  name: adminDataModelPlanChoicePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelPlanChoicePageRouteName });
  },
});

export const adminDataModelReviewsPageRouteName = 'Admin_DataModel_Reviews_Page';
adminRoutes.route('/datamodel/reviews', {
  name: adminDataModelReviewsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelReviewsPageRouteName });
  },
});

export const adminDataModelSemestersPageRouteName = 'Admin_DataModel_Semesters_Page';
adminRoutes.route('/datamodel/semesters', {
  name: adminDataModelSemestersPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelSemestersPageRouteName });
  },
});

export const adminDataModelSlugsPageRouteName = 'Admin_DataModel_Slugs_Page';
adminRoutes.route('/datamodel/slugs', {
  name: adminDataModelSlugsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelSlugsPageRouteName });
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

export const adminDataModelVerificationRequestsPageRouteName = 'Admin_DataModel_Verification_Requests_Page';
adminRoutes.route('/datamodel/verification-requests', {
  name: adminDataModelVerificationRequestsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminDataModelVerificationRequestsPageRouteName });
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

export const adminModerationPageRouteName = 'Admin_Moderation_Page';
adminRoutes.route('/moderation', {
  name: adminModerationPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminModerationPageRouteName });
  },
});


export const adminAnalyticsHomePageRouteName = 'Admin_Analytics_Home_Page';
adminRoutes.route('/analytics', {
  name: adminAnalyticsHomePageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsHomePageRouteName });
  },
});

export const adminAnalyticsActivityMonitorPageRouteName = 'Admin_Analytics_Activity_Monitor_Page';
adminRoutes.route('/analytics/activity-monitor', {
  name: adminAnalyticsActivityMonitorPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsActivityMonitorPageRouteName });
  },
});

export const adminAnalyticsNewsletterPageRouteName = 'Admin_Analytics_Newsletter_Page';
adminRoutes.route('/analytics/newsletter', {
  name: adminAnalyticsNewsletterPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsNewsletterPageRouteName });
  },
});

export const adminAnalyticsOverheadAnalysisPageRouteName = 'Admin_Analytics_Overhead_Analytics_Page';
adminRoutes.route('/analytics/overhead-analysis', {
  name: adminAnalyticsOverheadAnalysisPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsOverheadAnalysisPageRouteName });
  },
});

export const adminAnalyticsStudentsPageRouteName = 'Admin_Analytics_Students_Page';
adminRoutes.route('/analytics/students/summary', {
  name: adminAnalyticsStudentsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsStudentsPageRouteName });
  },
});

export const adminAnalyticsUserInteractionsPageRouteName = 'Admin_Analytics_User_Interactions_Page';
adminRoutes.route('/analytics/user-interactions', {
  name: adminAnalyticsUserInteractionsPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: adminAnalyticsUserInteractionsPageRouteName });
  },
});

const scoreboardPage = 'Scoreboard_Page';
const courseScoreboardPage = 'Course_Scoreboard_Page';
const opportunityScoreboardPage = 'Opportunity_Scoreboard_Page';

export const adminScoreboardPageRouteName = 'Admin_Scoreboard_Page';
adminRoutes.route('/scoreboard', {
  name: adminScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: scoreboardPage });
  },
});

export const adminCourseScoreboardPageRouteName = 'Admin_Course_Scoreboard_Page';
adminRoutes.route('/scoreboard/course', {
  name: adminCourseScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: courseScoreboardPage });
  },
});

export const adminOpportunityScoreboardPageRouteName = 'Admin_Opportunity_Scoreboard_Page';
adminRoutes.route('/scoreboard/opportunity', {
  name: adminOpportunityScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Admin_Layout', { main: opportunityScoreboardPage });
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

export const advisorModerationPageRouteName = 'Advisor_Moderation_Page';
advisorRoutes.route('/moderation', {
  name: advisorModerationPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorModerationPageRouteName });
  },
});

export const advisorAcademicPlanPageRouteName = 'Advisor_Academic_Plan_Page';
advisorRoutes.route('/academic-plan', {
  name: advisorAcademicPlanPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: advisorAcademicPlanPageRouteName });
  },
});

export const advisorScoreboardPageRouteName = 'Advisor_Scoreboard_Page';
advisorRoutes.route('/scoreboard', {
  name: advisorScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: scoreboardPage });
  },
});

export const advisorCourseScoreboardPageRouteName = 'Advisor_Course_Scoreboard_Page';
advisorRoutes.route('/scoreboard/course', {
  name: advisorCourseScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: courseScoreboardPage });
  },
});

export const advisorOpportunityScoreboardPageRouteName = 'Advisor_Opportunity_Scoreboard_Page';
advisorRoutes.route('/scoreboard/opportunity', {
  name: advisorOpportunityScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Advisor_Layout', { main: opportunityScoreboardPage });
  },
});

/*                        ALUMNI ROUTES                        */

const alumniRoutes = FlowRouter.group({
  prefix: '/alumni/:username',
  name: 'alumni',
  triggersEnter: [addBodyClass],
  triggersExit: [removeBodyClass],
});

export const alumniHomePageRouteName = 'Alumni_Home_Page';
alumniRoutes.route('/home', {
  name: alumniHomePageRouteName,
  action() {
    BlazeLayout.render('Alumni_Layout', { main: alumniHomePageRouteName });
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

export const facultyExplorerPageRouteName = 'Faculty_Explorer_Page';
facultyRoutes.route('/explorer', {
  name: facultyExplorerPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_Page' });
  },
});

export const facultyCardExplorerCareerGoalsPageRouteName = 'Faculty_Card_Explorer_CareerGoals_Page';
facultyRoutes.route('/explorer/career-goals/', {
  name: facultyCardExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_CareerGoals_Page' });
  },
});

export const facultyExplorerCareerGoalsPageRouteName = 'Faculty_Explorer_CareerGoals_Page';
facultyRoutes.route('/explorer/career-goals/:careerGoal', {
  name: facultyExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_CareerGoals_Page' });
  },
});

export const facultyCardExplorerCoursesPageRouteName = 'Faculty_Card_Explorer_Courses_Page';
facultyRoutes.route('/explorer/courses/', {
  name: facultyCardExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_Courses_Page' });
  },
});

export const facultyExplorerCoursesPageRouteName = 'Faculty_Explorer_Courses_Page';
facultyRoutes.route('/explorer/courses/:course', {
  name: facultyExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_Courses_Page' });
  },
});

export const facultyCardExplorerInterestsPageRouteName = 'Faculty_Card_Explorer_Interests_Page';
facultyRoutes.route('/explorer/interests/', {
  name: facultyCardExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_Interests_Page' });
  },
});

export const facultyExplorerInterestsPageRouteName = 'Faculty_Explorer_Interests_Page';
facultyRoutes.route('/explorer/interests/:interest', {
  name: facultyExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_Interests_Page' });
  },
});

export const facultyCardExplorerOpportunitiesPageRouteName = 'Faculty_Card_Explorer_Opportunities_Page';
facultyRoutes.route('/explorer/opportunities/', {
  name: facultyCardExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_Opportunities_Page' });
  },
});

export const facultyExplorerOpportunitiesPageRouteName = 'Faculty_Explorer_Opportunities_Page';
facultyRoutes.route('/explorer/opportunities/:opportunity', {
  name: facultyExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_Opportunities_Page' });
  },
});

export const facultyCardExplorerPlansPageRouteName = 'Faculty_Card_Explorer_Plans_Page';
facultyRoutes.route('/explorer/plans/', {
  name: facultyCardExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_Plans_Page' });
  },
});

export const facultyExplorerPlansPageRouteName = 'Faculty_Explorer_Plans_Page';
facultyRoutes.route('/explorer/plans/:plan', {
  name: facultyExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Explorer_Plans_Page' });
  },
});

export const facultyCardExplorerUsersPageRouteName = 'Faculty_Card_Explorer_Users_Page';
facultyRoutes.route('/explorer/users/', {
  name: facultyCardExplorerUsersPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: 'Card_Explorer_Users_Page' });
  },
});

export const facultyVerificationPageRouteName = 'Faculty_Verification_Page';
facultyRoutes.route('/verification', {
  name: facultyVerificationPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: facultyVerificationPageRouteName });
  },
});

export const facultyVerificationCompletedPageRouteName = 'Faculty_Verification_Completed_Page';
facultyRoutes.route('/verification-completed', {
  name: facultyVerificationCompletedPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: facultyVerificationCompletedPageRouteName });
  },
});

export const facultyManageOpportunitiesPageRouteName = 'Faculty_Manage_Opportunities_Page';
facultyRoutes.route('/manage-opportunities', {
  name: facultyManageOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: facultyManageOpportunitiesPageRouteName });
  },
});

export const facultyScoreboardPageRouteName = 'Faculty_Scoreboard_Page';
facultyRoutes.route('/scoreboard', {
  name: facultyScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: scoreboardPage });
  },
});

export const facultyCourseScoreboardPageRouteName = 'Faculty_Course_Scoreboard_Page';
facultyRoutes.route('/scoreboard/course', {
  name: facultyCourseScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: courseScoreboardPage });
  },
});

export const facultyOpportunityScoreboardPageRouteName = 'Faculty_Opportunity_Scoreboard_Page';
facultyRoutes.route('/scoreboard/opportunity', {
  name: facultyOpportunityScoreboardPageRouteName,
  action() {
    BlazeLayout.render('Faculty_Layout', { main: opportunityScoreboardPage });
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

export const landingExplorerPageRouteName = 'Landing_Explorer_Page';
FlowRouter.route('/explorer', {
  name: landingExplorerPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerPageRouteName });
  },
});

export const landingCardExplorerCareerGoalsPageRouteName = 'Landing_Card_Explorer_CareerGoals_Page';
FlowRouter.route('/explorer/career-goals/', {
  name: landingCardExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingCardExplorerCareerGoalsPageRouteName });
  },
});

export const landingExplorerCareerGoalsPageRouteName = 'Landing_Explorer_CareerGoals_Page';
FlowRouter.route('/explorer/career-goals/:careerGoal', {
  name: landingExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerCareerGoalsPageRouteName });
  },
});

export const landingCardExplorerCoursesPageRouteName = 'Landing_Card_Explorer_Courses_Page';
FlowRouter.route('/explorer/courses/', {
  name: landingCardExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingCardExplorerCoursesPageRouteName });
  },
});

export const landingExplorerCoursesPageRouteName = 'Landing_Explorer_Courses_Page';
FlowRouter.route('/explorer/courses/:course', {
  name: landingExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerCoursesPageRouteName });
  },
});

export const landingCardExplorerPlansPageRouteName = 'Landing_Card_Explorer_Plans_Page';
FlowRouter.route('/explorer/plans/', {
  name: landingCardExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingCardExplorerPlansPageRouteName });
  },
});

export const landingExplorerPlansPageRouteName = 'Landing_Explorer_Plans_Page';
FlowRouter.route('/explorer/plans/:plan', {
  name: landingExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerPlansPageRouteName });
  },
});

export const landingCardExplorerInterestsPageRouteName = 'Landing_Card_Explorer_Interests_Page';
FlowRouter.route('/explorer/interests/', {
  name: landingCardExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingCardExplorerInterestsPageRouteName });
  },
});

export const landingExplorerInterestsPageRouteName = 'Landing_Explorer_Interests_Page';
FlowRouter.route('/explorer/interests/:interest', {
  name: landingExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingExplorerInterestsPageRouteName });
  },
});

export const landingCardExplorerOpportunitiesPageRouteName = 'Landing_Card_Explorer_Opportunities_Page';
FlowRouter.route('/explorer/opportunities/', {
  name: landingCardExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Landing_Dynamic_Layout', { main: landingCardExplorerOpportunitiesPageRouteName });
  },
});

export const landingExplorerOpportunitiesPageRouteName = 'Landing_Explorer_Opportunities_Page';
FlowRouter.route('/explorer/opportunities/:opportunity', {
  name: landingExplorerOpportunitiesPageRouteName,
  action() {
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
    BlazeLayout.render('Guided_Tour_Layout', { main: studentGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const advisorGuidedTourPageRouteName = 'Advisor_Guided_Tour_Page';
FlowRouter.route('/guidedtour/advisor', {
  name: advisorGuidedTourPageRouteName,
  action() {
    BlazeLayout.render('Guided_Tour_Layout', { main: advisorGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const facultyGuidedTourPageRouteName = 'Faculty_Guided_Tour_Page';
FlowRouter.route('/guidedtour/faculty', {
  name: facultyGuidedTourPageRouteName,
  action() {
    BlazeLayout.render('Guided_Tour_Layout', { main: facultyGuidedTourPageRouteName });
  },
  triggersEnter: [scrollTop, addGuidedTourBodyClass],
  triggersExit: [removeGuidedTourBodyClass],
});

export const mentorGuidedTourPageRouteName = 'Mentor_Guided_Tour_Page';
FlowRouter.route('/guidedtour/mentor', {
  name: mentorGuidedTourPageRouteName,
  action() {
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
    BlazeLayout.render('Mentor_Layout', { main: mentorHomePageRouteName });
  },
});

export const mentorExplorerPageRouteName = 'Mentor_Explorer_Page';
mentorRoutes.route('/explorer', {
  name: mentorExplorerPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_Page' });
  },
});

export const mentorCardExplorerCareerGoalsPageRouteName = 'Mentor_Card_Explorer_CareerGoals_Page';
mentorRoutes.route('/explorer/career-goals/', {
  name: mentorCardExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_CareerGoals_Page' });
  },
});

export const mentorExplorerCareerGoalsPageRouteName = 'Mentor_Explorer_CareerGoals_Page';
mentorRoutes.route('/explorer/career-goals/:careerGoal', {
  name: mentorExplorerCareerGoalsPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_CareerGoals_Page' });
  },
});

export const mentorCardExplorerCoursesPageRouteName = 'Mentor_Card_Explorer_Courses_Page';
mentorRoutes.route('/explorer/courses/', {
  name: mentorCardExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_Courses_Page' });
  },
});

export const mentorExplorerCoursesPageRouteName = 'Mentor_Explorer_Courses_Page';
mentorRoutes.route('/explorer/courses/:course', {
  name: mentorExplorerCoursesPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_Courses_Page' });
  },
});

export const mentorCardExplorerInterestsPageRouteName = 'Mentor_Card_Explorer_Interests_Page';
mentorRoutes.route('/explorer/interests/', {
  name: mentorCardExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_Interests_Page' });
  },
});

export const mentorExplorerInterestsPageRouteName = 'Mentor_Explorer_Interests_Page';
mentorRoutes.route('/explorer/interests/:interest', {
  name: mentorExplorerInterestsPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_Interests_Page' });
  },
});

export const mentorCardExplorerOpportunitiesPageRouteName = 'Mentor_Card_Explorer_Opportunities_Page';
mentorRoutes.route('/explorer/opportunities/', {
  name: mentorCardExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_Opportunities_Page' });
  },
});

export const mentorExplorerOpportunitiesPageRouteName = 'Mentor_Explorer_Opportunities_Page';
mentorRoutes.route('/explorer/opportunities/:opportunity', {
  name: mentorExplorerOpportunitiesPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_Opportunities_Page' });
  },
});

export const mentorCardExplorerPlansPageRouteName = 'Mentor_Card_Explorer_Plans_Page';
mentorRoutes.route('/explorer/plans/', {
  name: mentorCardExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_Plans_Page' });
  },
});

export const mentorExplorerPlansPageRouteName = 'Mentor_Explorer_Plans_Page';
mentorRoutes.route('/explorer/plans/:plan', {
  name: mentorExplorerPlansPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Explorer_Plans_Page' });
  },
});

export const mentorCardExplorerUsersPageRouteName = 'Mentor_Card_Explorer_Users_Page';
mentorRoutes.route('/explorer/users/', {
  name: mentorCardExplorerUsersPageRouteName,
  action() {
    BlazeLayout.render('Mentor_Layout', { main: 'Card_Explorer_Users_Page' });
  },
});

export const mentorMentorSpacePageRouteName = 'Mentor_MentorSpace_Page';
mentorRoutes.route('/mentor-space', {
  name: mentorMentorSpacePageRouteName,
  action() {
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

export const studentCardExplorerCareerGoalsPageRouteName = 'Student_Card_Explorer_CareerGoals_Page';
studentRoutes.route('/explorer/career-goals/', {
  name: studentCardExplorerCareerGoalsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_CareerGoals_Page' });
  },
});

export const studentExplorerCareerGoalsPageRouteName = 'Student_Explorer_CareerGoals_Page';
studentRoutes.route('/explorer/career-goals/:careerGoal', {
  name: studentExplorerCareerGoalsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_CareerGoals_Page' });
  },
});

export const studentExplorerCoursesPageRouteName = 'Student_Explorer_Courses_Page';
studentRoutes.route('/explorer/courses/:course', {
  name: studentExplorerCoursesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_Courses_Page' });
  },
});

export const studentCardExplorerCoursesPageRouteName = 'Student_Card_Explorer_Courses_Page';
studentRoutes.route('/explorer/courses/', {
  name: studentCardExplorerCoursesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_Courses_Page' });
  },
});

export const studentCardExplorerInterestsPageRouteName = 'Student_Card_Explorer_Interests_Page';
studentRoutes.route('/explorer/interests/', {
  name: studentCardExplorerInterestsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_Interests_Page' });
  },
});

export const studentExplorerInterestsPageRouteName = 'Student_Explorer_Interests_Page';
studentRoutes.route('/explorer/interests/:interest', {
  name: studentExplorerInterestsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_Interests_Page' });
  },
});

export const studentCardExplorerOpportunitiesPageRouteName = 'Student_Card_Explorer_Opportunities_Page';
studentRoutes.route('/explorer/opportunities/', {
  name: studentCardExplorerOpportunitiesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_Opportunities_Page' });
  },
});

export const studentExplorerOpportunitiesPageRouteName = 'Student_Explorer_Opportunities_Page';
studentRoutes.route('/explorer/opportunities/:opportunity', {
  name: studentExplorerOpportunitiesPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_Opportunities_Page' });
  },
});

export const studentCardExplorerPlansPageRouteName = 'Student_Card_Explorer_Plans_Page';
studentRoutes.route('/explorer/plans/', {
  name: studentCardExplorerPlansPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_Plans_Page' });
  },
});

export const studentExplorerPlansPageRouteName = 'Student_Explorer_Plans_Page';
studentRoutes.route('/explorer/plans/:plan', {
  name: studentExplorerPlansPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_Plans_Page' });
  },
});

export const studentCardExplorerUsersPageRouteName = 'Student_Card_Explorer_Users_Page';
studentRoutes.route('/explorer/users/', {
  name: studentCardExplorerUsersPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Card_Explorer_Users_Page' });
  },
});

export const studentHomePageRouteName = 'Student_Home_Page';
studentRoutes.route('/home', {
  name: studentHomePageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomePageRouteName });
  },
});

export const studentHomeAboutMePageRouteName = 'Student_Home_AboutMe_Page';
studentRoutes.route('/home/aboutme', {
  name: studentHomeAboutMePageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeAboutMePageRouteName });
  },
});

export const studentHomeLogPageRouteName = 'Student_Home_Log_Page';
studentRoutes.route('/home/log', {
  name: studentHomeLogPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeLogPageRouteName });
  },
});

export const studentHomeLevelsPageRouteName = 'Student_Home_Levels_Page';
studentRoutes.route('/home/levels', {
  name: studentHomeLevelsPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeLevelsPageRouteName });
  },
});

export const studentHomeIcePageRouteName = 'Student_Home_Ice_Page';
studentRoutes.route('/home/ice', {
  name: studentHomeIcePageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentHomeIcePageRouteName });
  },
});

export const studentDegreePlannerPageRouteName = 'Student_Degree_Planner_Page';
studentRoutes.route('/degree-planner', {
  name: studentDegreePlannerPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentDegreePlannerPageRouteName });
  },
});

export const studentMentorSpacePageRouteName = 'Student_MentorSpace_Page';
studentRoutes.route('/mentor-space', {
  name: studentMentorSpacePageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: studentMentorSpacePageRouteName });
  },
});

export const studentExplorerPageRouteName = 'Student_Explorer_Page';
studentRoutes.route('/explorer', {
  name: studentExplorerPageRouteName,
  triggersEnter: [trackPath],
  action() {
    BlazeLayout.render('Student_Layout', { main: 'Explorer_Page' });
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
