import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

Template.List_Mentor_Questions_Widget.onCreated(function listMentorQuestionsOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Mentor_Questions_Widget.helpers({
  title(question) {
    const fullName = Users.getFullName(StudentProfiles.getProfile(question.studentID).username);
    return `${question.question} (${fullName})`;
  },
  mentorQuestions() {
    const questions = MentorQuestions.find({}).fetch();
    const items = _.sortBy(questions, ['question', function (a) {
      return StudentProfiles.getProfile(a.studentID).username;
    }]);
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return MentorQuestions.count();
  },
  slugName(slugID) {
    if (Slugs.isDefined(slugID)) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  descriptionPairs(question) {
    return [
      { label: 'Student', value: Users.getFullName(StudentProfiles.getProfile(question.studentID).username) },
      { label: 'Question', value: question.question },
      { label: 'Moderated', value: question.moderated.toString() },
      { label: 'Visible', value: question.visible.toString() },
      { label: 'Moderator Comments', value: question.moderatorComments },
      { label: 'Retired', value: question.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return MentorQuestions;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Mentor_Questions_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'MentorQuestionCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
