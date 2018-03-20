import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { processVerificationEventMethod } from '../../../api/verification/VerificationRequestCollection.methods';

Template.Verification_Event.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.log = new ReactiveVar('');
});

Template.Verification_Event.helpers({
  events() {
    return Opportunities.find({ eventDate: { $exists: true } }).fetch();
  },
  eventDate(event) {
    const m = moment(event.eventDate);
    return m.format('MM/DD/YY');
  },
  logValue() {
    return Template.instance().log.get();
  },
});

/**
 * Appends the passed message to the reactive variable holding the log text.
 * @param instance The template instance.
 * @param message The message to be appended to the log.
 * @memberOf ui/components/shared
 */
function appendToLog(instance, message) {
  instance.log.set(`${instance.log.get()}\n${message}`);
}


Template.Verification_Event.events({
  submit: function submit(event) {
    event.preventDefault();
    const instance = Template.instance();

    // Verify that an opportunity was selected.
    let opportunityID;
    let opportunity;
    try {
      opportunityID = event.target.elements[0].selectedOptions[0].value;
      opportunity = Opportunities.findDoc(opportunityID);
    } catch (e) {
      appendToLog(instance, 'Error: Please select an opportunity.');
      return;
    }

    // Only Opportunities with eventDates are available in this widget.
    const semester = Semesters.getSemester(opportunity.eventDate);

    // Verify that the student username is valid.
    const student = event.target.elements[1].value;
    try {
      Users.getID(student);
    } catch (e) {
      appendToLog(instance, `Error: User ${student} not found.`);
      return;
    }

    appendToLog(instance, `Verifying ${opportunity.name} for ${student}`);
    processVerificationEventMethod.call({ student, opportunity, semester }, (error, result) => {
      if (error) {
        appendToLog(instance, `Error: problem during processing: ${error}`);
      } else {
        appendToLog(instance, `${result}\n`);
      }
    });
  },
});

Template.Verification_Event.onRendered(function eventVerificationOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
