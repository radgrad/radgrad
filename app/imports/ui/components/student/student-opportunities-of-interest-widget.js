import { Template } from 'meteor/templating';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Student_Opportunities_Of_Interest_Widget.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());

});
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
});

Template.Student_Opportunities_Of_Interest_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Opportunities_Of_Interest_Widget.onRendered({});
