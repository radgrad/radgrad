import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Student_Explorer_Opportunities_Widget_Button.helpers({
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
    _.forEach(oi, function (o) {
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
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const opportunity = this.opportunity;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, function (o) {
      takenSemesters.push(o.semesterID);
    });
    _.forEach(semesters, function (sem) {
      if (Semesters.findDoc(sem).semesterNumber >= currentSemester.semesterNumber) {
        if (!_.includes(takenSemesters, sem)) {
          semesterNames.push(Semesters.toString(sem));
        }
      }
    });
    return semesterNames.slice(0, 8);
  },
});

Template.Student_Explorer_Opportunities_Widget_Button.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const opportunity = this.opportunity;
    const semester = event.target.text;
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const definitionData = {
      semester: semSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    defineMethod.call({ collectionName: 'OpportunityInstanceCollection', definitionData });
    const interactionData = { username, type: 'addOpportunity', typeData: oppSlug.name };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
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
    removeItMethod.call({ collectionName: 'OpportunityInstanceCollection', instance: oi[0]._id });
    const interactionData = { username: getRouteUserName(), type: 'removeOpportunity',
      typeData: Slugs.getNameFromID(opportunity.slugID) };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Student_Explorer_Opportunities_Widget_Button.onRendered(function
studentExplorerOpportunitiesWidgetButtonOnRendered() {
  const template = this;
  template.$('.chooseSemester')
    .popup({
      on: 'click',
    });
});
