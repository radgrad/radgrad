import { Template } from 'meteor/templating';

Template.Mentor_Question_Form_Field.helpers({
  isSelected(question, selectedQuestion) {
    return question === selectedQuestion;
  },
});

Template.Mentor_Question_Form_Field.onRendered(function mentorQuestionFormFieldOnRendered() {
  this.$('.dropdown').dropdown();
});
