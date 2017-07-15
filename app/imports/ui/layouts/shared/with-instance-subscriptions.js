import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection.js';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

/* eslint-disable object-shorthand */

// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ cacheLimit: 20, expireIn: 30 });

Template.With_Instance_Subscriptions.onCreated(function withInstanceSubscriptionsOnCreated() {
  const self = this;
  self.ready = new ReactiveVar();
  this.autorun(function () {
    if (getUserIdFromRoute()) {  // if logged out don't subscribe
      instanceSubs.subscribe(AcademicYearInstances.publicationNames.PerStudentID, getUserIdFromRoute());
      instanceSubs.subscribe(CourseInstances.publicationNames.studentID, getUserIdFromRoute());
    }
    instanceSubs.subscribe(AdvisorLogs.getPublicationName());
    instanceSubs.subscribe(CourseInstances.publicationNames.publicStudent);
    instanceSubs.subscribe(FeedbackInstances.getPublicationName());
    instanceSubs.subscribe(Feeds.getPublicationName());
    instanceSubs.subscribe(MentorAnswers.getPublicationName());
    instanceSubs.subscribe(MentorQuestions.getPublicationName());
    instanceSubs.subscribe(OpportunityInstances.publicationNames.student);
    instanceSubs.subscribe(VerificationRequests.getPublicationName());
    self.ready.set(instanceSubs.ready());
  });
});

Template.With_Instance_Subscriptions.helpers({
  subsReady: function () {
    return Template.instance().ready.get();
  },
});
