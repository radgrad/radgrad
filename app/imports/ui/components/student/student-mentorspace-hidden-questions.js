import { Template } from 'meteor/templating';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_MentorSpace_Hidden_Questions.helpers({
  moderated(question) {
    let color;
    let icon;
    let message;
    if (question.moderated === true) {
      color = 'negative';
      icon = 'yellow warning sign';
      const comments = question.moderatorComments ? `Moderator Comments: ${question.moderatorComments}` : '';
      message = `Please delete and resubmit your question. ${comments}`;
    } else {
      color = 'warning';
      icon = 'green checkmark';
      message = 'The following question is currently queued for review by a RadGrad moderator.';
    }
    return { color, icon, message };
  },
  questions() {
    return MentorQuestions.find({ studentID: getUserIdFromRoute(), visible: false }).fetch();
  },
});

Template.Student_MentorSpace_Hidden_Questions.events({
  'click .discard': function (event) {
    event.preventDefault();
    const instance = event.target.value;
    const collectionName = MentorQuestions.getCollectionName();
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.log('Error removing MentorQuestion', error);
      }
    });
  },
});

Template.Student_MentorSpace_Hidden_Questions.onRendered(function studentMentorSpaceHiddenQuestionsOnRendered() {
  this.$('.ui.accordion').accordion();
});
