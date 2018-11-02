import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

function interestedUsers(opportunity) {
  const interested = [];
  const ci = OpportunityInstances.find({
    opportunityID: opportunity._id,
  }).fetch();
  _.forEach(ci, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

function numUsers(opportunity) {
  return interestedUsers(opportunity).length;
}

function opportunityType(opportunity) {
  const oppType = opportunity.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
}

function sponsor(opportunity) {
  return Users.getFullName(opportunity.sponsorID);
}

function semesters(opportunity) {
  const semesterIDs = opportunity.semesterIDs;
  return _.map(semesterIDs, (semID) => Semesters.toString(semID));
}

function teaser(opp) {
  const oppTeaser = Teasers.find({ opportunityID: opp._id }).fetch();
  return oppTeaser[0];
}

Template.Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const addedOpportunities = [];
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const allOpportunities = _.filter(opps, (o) => !o.retired);
    const userID = getUserIdFromRoute();
    _.forEach(allOpportunities, (opportunity) => {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        addedOpportunities.push(opportunity);
      }
    });
    return addedOpportunities;
  },
  completed() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    let ret = false;
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity[0]._id,
      verified: true,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  },
  descriptionPairs(opportunity) {
    return [
      { label: 'Opportunity Type', value: opportunityType(opportunity) },
      { label: 'Semesters', value: semesters(opportunity) },
      { label: 'Event Date', value: opportunity.eventDate },
      { label: 'Sponsor', value: sponsor(opportunity) },
      { label: 'Description', value: opportunity.description },
      { label: 'Interests', value: opportunity.interestIDs },
      { label: 'ICE', value: opportunity.ice },
      { label: 'Teaser', value: teaser(opportunity) },
    ];
  },
  nonAddedOpportunities() {
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const allOpportunities = _.filter(opps, (o) => !o.retired);
    const userID = getUserIdFromRoute();
    const nonAddedOpportunities = _.filter(allOpportunities, function (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        return false;
      }
      return true;
    });
    return nonAddedOpportunities;
  },
  opportunity() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0];
  },
  reviewed(opportunity) {
    let ret = false;
    const review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: opportunity._id,
    }).fetch();
    if (review.length > 0) {
      ret = true;
    }
    return ret;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(opportunity) {
    return [
      { label: 'students', amount: numUsers(opportunity),
        value: interestedUsers(opportunity) },
    ];
  },
});
