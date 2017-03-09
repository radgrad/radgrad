import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_MentorSpace_Questions_Accordion.onCreated(function studentMentorSpacePageAccordionOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName(5), getUserIdFromRoute());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(MentorQuestions.getPublicationName());
  this.subscribe(MentorAnswers.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName(3), getUserIdFromRoute());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(AcademicYearInstances.getPublicationName(1), getUserIdFromRoute());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Student_MentorSpace_Questions_Accordion.onRendered(function studentMentorSpaceQuestionsAccordionOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
});

Template.Student_MentorSpace_Questions_Accordion.helpers({
  answerCount(questionID) {
    return MentorAnswers.getAnswers(questionID).count();
  },
  isOneAnswer(questionID) {
    return MentorAnswers.getAnswers(questionID).count() === 1;
  },
  listAnswers(questionID) {
    return MentorAnswers.getAnswers(questionID);
  },
  mentorName(mentorID) {
    const firstName = Users.find({ _id: mentorID }).fetch()[0].firstName;
    const lastName = Users.find({ _id: mentorID }).fetch()[0].lastName;
    return `${firstName}  ${lastName}`;
  },
  picture(mentorID) {
    return Users.find({ _id: mentorID }).fetch()[0].picture;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userUsername(mentorID) {
    return Users.find({ _id: mentorID }).fetch()[0].username;
  },
});
