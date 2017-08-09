import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_MentorSpace_Question_Form.events({
  'submit .mentorspace-question-form': function (event) {
    event.preventDefault();
    const question = event.target.msQuestion.value;
    const collectionName = MentorQuestions.getCollectionName();
    const student = getRouteUserName();
    const slug = `${student}${moment().format('YYYYMMDDHHmmssSSSSS')}`;
    const mentorQuestion = { question, slug, student };
    defineMethod.call({ collectionName, definitionData: mentorQuestion }, () => {
      // console.log('define Mentor Question', error, result);
      event.target.reset();
    });
  },
});
