import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Opportunities_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Opportunities_Of_Interest_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
  opportunityCount() {
    return Opportunities.find().count();
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
  opportunityShortDescription(description){
    if(description.length > 200) {
      description = description.substring(0,200)+"...";
    }
    return description;
  }
});

Template.Student_Opportunities_Of_Interest_Widget.events({

});

Template.Student_Opportunities_Of_Interest_Widget.onRendered(function studentOpportunitiesOfInterestWidgetOnRendered(){

});
