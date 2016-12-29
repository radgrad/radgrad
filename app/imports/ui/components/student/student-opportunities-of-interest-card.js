import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Opportunities_Of_Interest_Card.onCreated(function studentOpportunitiesOfInterestCardOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
});

function interestedStudentsHelper(opp) {
  const interested = [];
  const temp = OpportunityInstances.find().fetch();
  const oi = OpportunityInstances.find({
    opportunityID: opp._id,
  }).fetch();
  _.map(oi, (o) => {
    if (!_.includes(interested, o)) {
      interested.push(Users.findDoc(o.studentID));
    }
  });
  return interested;
}

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
    const semesterNames = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    _.map(semesters, (sem) => {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        semesterNames.push(Semesters.toString(sem));
      }
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
  opportunityShortDescription(opp) {
    let description = opp.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)} ...`;
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
  interestedStudents(opp) {
    return interestedStudentsHelper(opp);
  },
  numberStudents(opp) {
    return interestedStudentsHelper(opp).length;
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
  studentPicture(student) {
    return `/images/landing/${student.picture}`;
  },
});

Template.Student_Opportunities_Of_Interest_Card.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const opportunity = this.opportunity;
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

Template.Student_Opportunities_Of_Interest_Card.onRendered(function studentOpportunitiesOfInterestCardOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
