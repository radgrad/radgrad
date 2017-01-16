import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { MentorProfiles } from '../../../api/mentor/MentorProfileCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Student_MentorSpace_Page.onCreated(function studentMentorSpacePageOnCreated() {
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(MentorQuestions.getPublicationName());
    this.subscribe(MentorAnswers.getPublicationName());
    this.subscribe(MentorProfiles.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Student_MentorSpace_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.

  questionsList() {
    return MentorQuestions.getQuestions({ approved: true });
  },

  mentorsList() {
    return Users.find({ roles: ['MENTOR'] });
  },

  mentorProfile(mentorID) {
    return MentorProfiles.getMentorProfile(mentorID).fetch()[0];
  },
});

Template.Student_MentorSpace_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.

});

Template.Student_MentorSpace_Page.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });

  this.$('.ui.dropdown')
    .dropdown()
  ;

  this.$('.ui.rating')
    .rating()
  ;
});
