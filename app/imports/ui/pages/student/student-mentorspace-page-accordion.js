import { Template } from 'meteor/templating';

Template.Student_MentorSpace_Page_Accordion.onRendered(function listMentorSpaceQuestionsOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
});
