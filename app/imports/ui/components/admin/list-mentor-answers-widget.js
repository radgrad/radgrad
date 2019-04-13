import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Mentor_Answers_Widget.onCreated(function listMentorAnswersOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Mentor_Answers_Widget.helpers({
  title(answer) {
    const question = MentorQuestions.findDoc(answer.questionID);
    const fullName = Users.getFullName(MentorProfiles.getProfile(answer.mentorID).username);
    return `${question.question} (${fullName})`;
  },
  mentorAnswers() {
    const answers = MentorAnswers.find({}).fetch();
    const items = _.sortBy(answers, [function (a) {
      return MentorQuestions.findDoc(a.questionID).question;
    }, function (a) {
      return MentorProfiles.getProfile(a.mentorID).username;
    }]);
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return MentorAnswers.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(answer) {
    return [
      { label: 'Mentor', value: Users.getFullName(MentorProfiles.getProfile(answer.mentorID).username) },
      { label: 'Answer', value: answer.text },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return MentorAnswers;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Mentor_Answers_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'MentorAnswerCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
