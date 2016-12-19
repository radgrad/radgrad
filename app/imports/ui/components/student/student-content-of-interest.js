import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';

Template.Student_Content_Of_Interest.onCreated(function appBodyOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

Template.Student_Content_Of_Interest.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
  opportunityInterests(opportunity) {
    return Interests.findNames(opportunity.interestIDs);
  },
  opportunitySemesters(semesterID) {
    const sem = Semesters.findDoc(semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return oppTerm + ' ' + oppYear;
  },
});

Template.Student_Content_Of_Interest.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Content_Of_Interest.onRendered({

});
