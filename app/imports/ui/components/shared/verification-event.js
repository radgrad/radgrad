// import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
// import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import { moment } from 'meteor/momentjs:moment';

Template.Verification_Event.helpers({
  events() {
    return Opportunities.find({ eventDate: { $exists: true } }).fetch();
  },
  eventDate(event) {
    const m = moment(event.eventDate);
    return m.format('MM/DD/YY');
  },
});

Template.Verification_Event.events({
  submit: function submit(event) {
    event.preventDefault();
    const opportunityID = event.target.elements[0].selectedOptions[0].value;
    const student = event.target.elements[1].value;
    const opportunity = Opportunities.findDoc(opportunityID);
    const opportunitySlug = Slugs.findDoc(opportunity.slugID).name;
    const semester = Semesters.getSemesterDoc(opportunity.eventDate);
    const semesterSlug = Slugs.findDoc(semester.slugID).name;
    try {
      const studentID = Users.getID(student);
      const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID }).fetch();
      if (opportunityInstances.length === 0) { // student didn't plan on attending in degree plan
        OpportunityInstances.define({ student, semester: semesterSlug, verified: true, opportunity: opportunitySlug });
      } else {
        const oppInstance = opportunityInstances[0];
        OpportunityInstances.updateVerified(oppInstance._id, true);
      }
    } catch (e) {
      alert(`${student} is not a valid student. ${e}`); // eslint-disable-line no-undef, no-alert
    }
  },
});

Template.Verification_Event.onCreated(function eventVerificationOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Verification_Event.onRendered(function eventVerificationOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
