import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from '../shared/route-user-name';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

function getOpportunities(studentID, isPast) {
  const opportunityInstances = OpportunityInstances.find({ studentID, verified: isPast }).fetch();
  const taken = [];
  _.map(opportunityInstances, (oi) => {
    if (_.indexOf(taken, oi) === -1) {
      taken.push(oi);
    }
  });
  return taken;
}

Template.User_Opportunity_Component.helpers({
  count(taken) {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getOpportunities(userID, taken).length;
    }
    return 0;
  },
  opportunitiesPlanned() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getOpportunities(userID, false);
    }
    return null;
  },
  opportunitiesCompleted() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getOpportunities(userID, true);
    }
    return null;
  },
  opportunityName(o) {
    const opportunity = Opportunities.findDoc(o.opportunityID);
    return opportunity.name;
  },
  opportunitySemester(o) {
    return Semesters.toString(o.semesterID);
  },
  opportunityURL(o) {
    const opportunity = Opportunities.findDoc(o.opportunityID);
    const slug = Opportunities.getSlug(opportunity._id);
    return `/student/${getRouteUserName()}/explorer/opportunities/${slug}`;
  },
});

Template.User_Opportunity_Component.onCreated(function userOpportunityComponentOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

Template.User_Opportunity_Component.onRendered(function userOpportunityComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});

