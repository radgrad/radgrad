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
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getGroupName } from '../../components/shared/route-group-name';

function interestedUsers(opportunity) {
  const interested = [];
  if (opportunity) {
    const ci = OpportunityInstances.find({
      opportunityID: opportunity._id,
    })
      .fetch();
    _.forEach(ci, (c) => {
      if (!_.includes(interested, c.studentID)) {
        interested.push(c.studentID);
      }
    });
  }
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
  const oppTeaser = Teasers.find({ targetSlugID: opp.slugID }).fetch();
  return oppTeaser[0];
}

Template.Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteOpportunities.find({ studentID }).fetch();
    return _.map(favorites, (f) => ({ item: Opportunities.findDoc(f.opportunityID), count: 1 }));
  },
  completed() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    if (opportunitySlugName) {
      let ret = false;
      const slug = Slugs.find({ name: opportunitySlugName })
        .fetch();
      const opportunity = Opportunities.find({ slugID: slug[0]._id })
        .fetch();
      const oi = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity[0]._id,
        verified: true,
      })
        .fetch();
      if (oi.length > 0) {
        ret = true;
      }
      return ret;
    }
    return false;
  },
  descriptionPairs(opportunity) {
    if (opportunity) {
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
    }
    return [];
  },
  nonAddedOpportunities() {
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = getUserIdFromRoute();
    const group = getGroupName();
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID !== userID);
    } else if (group === 'student') {
      const favorites = FavoriteOpportunities.find({ studentID: userID }).fetch();
      const favoriteIDs = _.map(favorites, (f) => f.opportunityID);
      const nonAddedOpportunities = _.filter(allOpportunities, function (opportunity) {
        return !_.includes(favoriteIDs, opportunity._id);
      });
      return nonAddedOpportunities;
    }
    return allOpportunities;
  },
  opportunity() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    if (opportunitySlugName) {
      const slug = Slugs.find({ name: opportunitySlugName })
        .fetch();
      const opportunity = Opportunities.find({ slugID: slug[0]._id })
        .fetch();
      return opportunity[0];
    }
    return opportunitySlugName;
  },
  reviewed(opportunity) {
    let ret = false;
    if (opportunity) {
      const review = Reviews.find({
        studentID: getUserIdFromRoute(),
        revieweeID: opportunity._id,
      })
        .fetch();
      if (review.length > 0) {
        ret = true;
      }
    }
    return ret;
  },
  slugName(slugID) {
    if (slugID) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  socialPairs(opportunity) {
    if (opportunity) {
      return [
        {
          label: 'students', amount: numUsers(opportunity),
          value: interestedUsers(opportunity),
        },
      ];
    }
    return [];
  },
});
