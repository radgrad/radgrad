import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { checkIntegrity } from '/imports/api/integrity/IntegrityChecker';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { WorkInstances } from '../../../api/work/WorkInstanceCollection.js';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection.js';

const clientDataKey = 'client';
const serverDataKey = 'server';

Template.Admin_DataBase_Integrity_Check_Page.helpers({
  hidden(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data) ? '' : 'hidden';
  },
  results(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data) ? data.message : '';
  },
  successOrError(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data && data.count === 0) ? 'success' : 'error';
  },
});

Template.Admin_DataBase_Integrity_Check_Page.onCreated(function onCreated() {
  this.results = new ReactiveDict();
  // this.subscribe(Slugs.getPublicationName());
  // this.subscribe(InterestTypes.getPublicationName());
  // this.subscribe(Interests.getPublicationName());
  // this.subscribe(CareerGoals.getPublicationName());
  // this.subscribe(Courses.getPublicationName());
  // this.subscribe(Semesters.getPublicationName());
  // this.subscribe(DesiredDegrees.getPublicationName());
  // this.subscribe(OpportunityTypes.getPublicationName());
  // this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  // this.subscribe(Users.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  // this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
  this.subscribe(WorkInstances.getPublicationName());
  // this.subscribe(HelpMessages.getPublicationName());
  this.subscribe(AdvisorLogs.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
  this.subscribe(AcademicYearInstances.getPublicationName());
  // this.subscribe(Feeds.getPublicationName());
  this.subscribe(MentorAnswers.getPublicationName());
  this.subscribe(MentorQuestions.getPublicationName());
  // this.subscribe(Teasers.getPublicationName());
  this.subscribe(ValidUserAccounts.getPublicationName());
});

Template.Admin_DataBase_Integrity_Check_Page.events({
  'click .jsIntegrityCheck': function clickJSIntegrityCheck(event, instance) {
    event.preventDefault();
    Meteor.call('IntegrityCheck', null, (error, result) => {
      if (error) {
        console.log('Error during integrity check: ', error);
      } else {
        instance.results.set(serverDataKey, result);
      }
    });
    instance.results.set(clientDataKey, checkIntegrity());
  },
});
