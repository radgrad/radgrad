import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { getRouteUserName } from '../shared/route-user-name';

function getAnswers(mentorID) {
  return MentorAnswers.find({ mentorID }).fetch();
}

Template.User_Answers_Component.helpers({
  count() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getAnswers(userID).length;
    }
    return 0;
  },
  questionName(answer) {
    const question = MentorQuestions.findDoc(answer.questionID);
    return question.title;
  },
  answers() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getAnswers(userID);
    }
    return null;
  },
  questionURL() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return `/student/${getRouteUserName()}/mentor-space`;
    } else if (group === 'faculty') {
      return `/mentor/${getRouteUserName()}/mentor-space`;
    }
    return `/mentor/${getRouteUserName()}/mentor-space`;
  },
});

Template.User_Answers_Component.onCreated(function userAnswersComponentOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
});

Template.User_Answers_Component.onRendered(function userAnswersComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});
