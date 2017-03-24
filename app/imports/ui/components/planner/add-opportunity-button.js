import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';

Template.Add_Opportunity_Button.onCreated(function addOpportunityButtonOnCreated() {
  this.state = this.data.dictionary;
});

Template.Add_Opportunity_Button.helpers({
  empty(list) {
    return list.length === 0;
  },
  equals(a, b) {
    return a === b;
  },
  existingSemesters() {
    const semesters = [];
    const opportunity = this.opportunity;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.map(oi, function (o) {
      if (!o.verified) {
        semesters.push(Semesters.toString(o.semesterID, false));
      }
    });
    return semesters;
  },
  opportunitySemesters() {
    const opp = this.opportunity;
    const semesters = opp.semesterIDs;
    const takenSemesters = [];
    const semesterNames = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    const opportunity = this.opportunity;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.map(oi, function (o) {
      takenSemesters.push(o.semesterID);
    });
    _.map(semesters, function (sem) {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        if (!_.includes(takenSemesters, sem)) {
          semesterNames.push(Semesters.toString(sem));
        }
      }
    });
    return semesterNames.slice(0, 8);
  },
});

Template.Add_Opportunity_Button.events({
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
    const opID = OpportunityInstances.define(oi);
    const doc = OpportunityInstances.findDoc(opID);
    Template.instance().state.set(plannerKeys.detailCourse, null);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, null);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, doc);
    Template.instance().$('.chooseSemester').popup('hide');
  },
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const opportunity = this.opportunity;
    const semester = event.target.text;
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const semID = Semesters.getID(semSlug);
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
      semesterID: semID,
    }).fetch();
    if (oi > 1) {
      console.log('Too many opportunity instances found for a single semester.');
    }
    const doc = Opportunities.findDoc(oi[0].opportunityID);
    OpportunityInstances.removeIt(oi[0]._id);
    Template.instance().state.set(plannerKeys.detailCourse, null);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, doc);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
    Template.instance().$('.chooseSemester').popup('hide');
  },
});

Template.Add_Opportunity_Button.onRendered(function addOpportunityButtonOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});

Template.Add_Opportunity_Button.onDestroyed(function addOpportunityButtonOnDestroyed() {
  // add your statement here
});

