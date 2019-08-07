import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { plannerKeys } from './academic-plan';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Detail_Opportunity_Card.onCreated(function detailopportunitycardOnCreated() {
  this.state = this.data.dictionary;
});

Template.Detail_Opportunity_Card.helpers({
  description() {
    const opportunity = Opportunities.findDoc(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).opportunityID);
    return opportunity.description;
  },
  futureInstance() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const instanceSemester = Semesters.findDoc(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).semesterID);
    return instanceSemester.semesterNumber >= currentSemester.semesterNumber;
  },
  hasRequest() {
    const instance = Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity);
    return VerificationRequests.find({ opportunityInstanceID: instance._id })
      .count() > 0;
  },
  ice() {
    return Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).ice;
  },
  isPastInstance() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const oi = Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity);
    const studentID = getUserIdFromRoute();
    const requests = VerificationRequests.find({ opportunityInstanceID: oi._id, studentID })
      .fetch();
    const oppSemester = Semesters.findDoc(oi.semesterID);
    return !oi.verified && oppSemester.semesterNumber <= currentSemester.semesterNumber && requests.length === 0;
  },
  instanceID() {
    return Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity)._id;
  },
  name() {
    const opportunity = Opportunities.findDoc(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).opportunityID);
    return opportunity.name;
  },
  opportunity() {
    const opportunity = Opportunities.findDoc(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).opportunityID);
    return opportunity;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunitySlug() {
    const opportunity = Opportunities.findDoc(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).opportunityID);
    return Slugs.getNameFromID(opportunity.slugID);
  },
  requestHistory() {
    const oppInstance = Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity);
    const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id })
      .fetch();
    if (request.length > 0) {
      return request[0].processed;
    }
    return '';
  },
  requestStatus() {
    const oppInstance = Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity);
    const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id })
      .fetch();
    if (request.length > 0) {
      return request[0].status;
    }
    return '';
  },
  requestWhenSubmitted() {
    const oppInstance = Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity);
    const request = VerificationRequests.find({ opportunityInstanceID: oppInstance._id })
      .fetch();
    if (request.length > 0) {
      const submitted = moment(request[0].submittedOn);
      return submitted.calendar();
    }
    return '';
  },
  semester() {
    return Semesters.toString(Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).semesterID);
  },
  unverified() {
    return !Template.instance()
      .state
      .get(plannerKeys.detailsOpportunity).verified;
  },
});

Template.Detail_Opportunity_Card.events({
  'click button.verifyInstance': function clickButtonVerifyInstance(event) {
    event.preventDefault();
    const id = event.target.id;
    const definitionData = { student: getRouteUserName(), opportunityInstance: id };
    const collectionName = VerificationRequests.getCollectionName();
    defineMethod.call({ collectionName, definitionData });
    const typeData = Slugs.getNameFromID(OpportunityInstances.getOpportunityDoc(id).slugID);
    const interactionData = { username: getRouteUserName(), type: 'verifyRequest', typeData };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Detail_Opportunity_Card.onRendered(function detailopportunitycardOnRendered() {
  // add your statement here
});

Template.Detail_Opportunity_Card.onDestroyed(function detailopportunitycardOnDestroyed() {
  // add your statement here
});

