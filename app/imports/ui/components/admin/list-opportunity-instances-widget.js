import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from './form-fields/form-field-utilities.js';

Template.List_Opportunity_Instances_Widget.onCreated(function onCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.List_Opportunity_Instances_Widget.helpers({
  opportunityInstances() {
    const allOpportunityInstances = OpportunityInstances.find().fetch();
    const sortBySemester = _.sortBy(allOpportunityInstances, function (oi) {
      return Semesters.toString(oi.semesterID, true);
    });
    const sortByStudent = _.sortBy(sortBySemester, function (oi) {
      return Users.getFullName(oi.studentID);
    });
    return _.sortBy(sortByStudent, function (oi) {
      return Opportunities.findDoc(oi.opportunityID).name;
    });
  },
  count() {
    return OpportunityInstances.count();
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(opportunityInstance) {
    return [
      { label: 'Semester', value: Semesters.toString(opportunityInstance.semesterID) },
      { label: 'Opportunity', value: (Opportunities.findDoc(opportunityInstance.opportunityID)).name },
      { label: 'Verified', value: opportunityInstance.verified.toString() },
      { label: 'Student', value: Users.getFullName(opportunityInstance.studentID) },
      { label: 'ICE', value: `${opportunityInstance.ice.i}, ${opportunityInstance.ice.c}, 
        ${opportunityInstance.ice.e}` },
    ];
  },
  name(oi) {
    return `${Opportunities.findDoc(oi.opportunityID).name}-${Users.findDoc(oi.studentID).username}-
      ${Semesters.toString(oi.semesterID, true)}`;
  },
});

Template.List_Opportunity_Instances_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    OpportunityInstances.removeIt(id);
  },
});
