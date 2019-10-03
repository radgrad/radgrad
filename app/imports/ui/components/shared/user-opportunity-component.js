import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from '../shared/route-user-name';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { getGroupName } from './route-group-name';

Template.User_Opportunity_Component.onCreated(function userOpportunityComponentOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
});

function getOpportunities(studentID, isPast) {
  const opportunityInstances = OpportunityInstances.find({ studentID, verified: isPast }).fetch();
  return _.uniq(opportunityInstances);
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
      const opportunities = getOpportunities(userID, false);
      const noRepeat = _.map(_.groupBy(opportunities, function (opp) {
        return opp.opportunityID;
      }), function (grouped) {
        return grouped[0];
      });
      return noRepeat;
    }
    return null;
  },
  opportunitiesCompleted() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const opportunities = getOpportunities(userID, true);
      const noRepeat = _.map(_.groupBy(opportunities, function (opp) {
        return opp.opportunityID;
      }), function (grouped) {
        return grouped[0];
      });
      return noRepeat;
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
    const group = getGroupName();
    if (group === 'student') {
      return `/student/${getRouteUserName()}/explorer/opportunities/${slug}`;
    } else if (group === 'faculty') {
      return `/faculty/${getRouteUserName()}/explorer/opportunities/${slug}`;
    }
    return `/mentor/${getRouteUserName()}/explorer/opportunities/${slug}`;
  },
});

Template.User_Opportunity_Component.onRendered(function userOpportunityComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});

