import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Opportunities_Of_Interest_Card.onCreated(function appBodyOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Opportunities_Of_Interest_Card.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
  opportunityName(opportunity) {
    return opportunity.name;
  },
  opportunitySemesters(opp) {
    const semesters = opp.semesterIDs;
    let semesterNames = [];
    _.map(semesters, (sem) => {
      semesterNames.push(Semesters.toString(sem));
  });
    return semesterNames;
  },
  interestName(interest) {
    return interest.name;
  },
  opportunityInterests(opp) {
    const ret = [];
    if (getRouteUserName()) {
      const opportunity = opp;
      _.map(opportunity.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
    });
    }
    return ret;
  },
  opportunitySemesterNames(semesterID) {
    const sem = Semesters.findDoc(semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return oppTerm + ' ' + oppYear;
  },
  opportunityShortDescription(description){
    if(description.length > 200) {
      description = description.substring(0,200)+"...";
    }
    return description;
  },
  userInterests() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
    });
    }
    return ret;
  },
  matchingInterests(opp) {
    const matchingInterests = [];
    const user = Users.findDoc({ username: getRouteUserName() });
    const userInterests = [];
    const opportunityInterests = [];
    _.map(opp.interestIDs, (id) => {
      opportunityInterests.push(Interests.findDoc(id));
    });
    _.map(user.interestIDs, (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.map(opportunityInterests, (oppInterest) => {
      _.map(userInterests, (userInterest) => {
      if (_.isEqual(oppInterest, userInterest)) {
        matchingInterests.push(userInterest);
      }
    });
  });
    return matchingInterests;
  },
});

Template.Student_Opportunities_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event, template) {
    event.preventDefault();
    const opportunity = this.opportunity;
    const name = opportunity.name;
    const semester = event.target.text;
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const oi = {
      semester: semSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    OpportunityInstances.define(oi);
  },
});

Template.Student_Opportunities_Of_Interest_Card.onRendered(function studentOpportunitiesOfInterestCardOnRendered(){
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
