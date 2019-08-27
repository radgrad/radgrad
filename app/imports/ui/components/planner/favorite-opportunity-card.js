import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Favorite_Opportunity_Card.onCreated(function favoriteOpportunityCardOnCreated() {
  // console.log(this);
});

Template.Favorite_Opportunity_Card.helpers({
  description() {
    const opp = Template.instance().data.opportunity;
    return opp.description;
  },
  ice() {
    const opp = Template.instance().data.opportunity;
    return opp.ice;
  },
  isInPlan() {
    const opp = Template.instance().data.opportunity;
    const studentID = getUserIdFromRoute();
    const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opp._id });
    return ois.length > 0;
  },
  name() {
    const opp = Template.instance().data.opportunity;
    return opp.name;
  },
  opportunity() {
    return Template.instance().data.opportunity;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  opportunitySlug() {
    const opp = Template.instance().data.opportunity;
    return Slugs.getNameFromID(opp.slugID);
  },
  semesters() {
    const opp = Template.instance().data.opportunity;
    const studentID = getUserIdFromRoute();
    const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opp._id });
    let semesterStr = '';
    _.forEach(ois, (instance) => {
      semesterStr += Semesters.toString(instance.semesterID, false);
      semesterStr += ', ';
    });
    return semesterStr.substring(0, semesterStr.length - 2);
  },
});
