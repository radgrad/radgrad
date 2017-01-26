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
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Student_MentorSpace_Questions_Accordion.onCreated(function studentMentorSpacePageAccordionOnCreated() {
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(MentorQuestions.getPublicationName());
    this.subscribe(MentorAnswers.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Student_MentorSpace_Questions_Accordion.onRendered(function listMentorSpaceQuestionsOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
});

Template.Student_MentorSpace_Questions_Accordion.helpers({
  listAnswers(questionID) {
    return MentorAnswers.getAnswers(questionID);
  },
  answerCount(questionID) {
    return MentorAnswers.getAnswers(questionID).count();
  },
  picture(mentorID) {
    return Users.find({ _id: mentorID }).fetch()[0].picture;
  },
  mentorName(mentorID) {
    const firstName = Users.find({ _id: mentorID }).fetch()[0].firstName;
    const lastName = Users.find({ _id: mentorID }).fetch()[0].lastName;
    return `${firstName}  ${lastName}`;
  },
  isOneAnswer(questionID) {
    return MentorAnswers.getAnswers(questionID).count() === 1;
  }
});
