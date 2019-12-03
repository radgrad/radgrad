import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

Template.Advisor_Layout.helpers({
  secondMenuItems() {
    let numMod = 0;
    numMod += MentorQuestions.find({ moderated: false }).fetch().length;
    numMod += Reviews.find({ moderated: false }).fetch().length;
    let moderationLabel = 'Moderation';
    if (numMod > 0) {
      moderationLabel = `${moderationLabel} (${numMod})`;
    }
    let numRequests = 0;
    numRequests += VerificationRequests.find({ status: 'Open' }).fetch().length;
    let requestsLabel = 'Verification Requests';
    if (numRequests > 0) {
      requestsLabel = `${requestsLabel} (${numRequests})`;
    }
    return [
      {
        label: 'Student Configuration',
        route: RouteNames.advisorStudentConfigurationPageRouteName,
        regex: 'home',
      },
      {
        label: requestsLabel,
        route: RouteNames.advisorVerificationRequestsPendingPageRouteName,
        regex: 'verification-requests|event-verification|completed-verifications',
      },
      {
        label: moderationLabel,
        route: RouteNames.advisorModerationPageRouteName,
        regex: 'moderation',
      },
      {
        label: 'Academic Plan',
        route: RouteNames.advisorAcademicPlanPageRouteName,
        regex: 'academic-plan',
      },
      {
        label: 'Scoreboard',
        route: RouteNames.advisorScoreboardPageRouteName,
        regex: 'scoreboard',
      },
    ];
  },
  secondMenuLength() {
    return 'five';
  },
});
