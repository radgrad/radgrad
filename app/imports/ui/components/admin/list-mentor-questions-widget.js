import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

Template.List_Mentor_Questions_Widget.helpers({
  title(question) {
    const fullName = Users.getFullName(StudentProfiles.getProfile(question.studentID).username);
    return `${question.question} (${fullName})`;
  },
  mentorQuestions() {
    const questions = MentorQuestions.find({}).fetch();
    const sorted = _.sortBy(questions, ['question', function (a) {
      return StudentProfiles.getProfile(a.studentID).username;
    }]);
    return sorted;
  },
  count() {
    return MentorQuestions.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(question) {
    return [
      { label: 'Student', value: Users.getFullName(StudentProfiles.getProfile(question.studentID).username) },
      { label: 'Question', value: question.question },
      { label: 'Moderated', value: question.moderated.toString() },
      { label: 'Visible', value: question.visible.toString() },
      { label: 'Moderator Comments', value: question.moderatorComments },
    ];
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
