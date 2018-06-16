import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Feedback_Instances_Widget.onCreated(function onCreated() {
  this.subscribe(FeedbackInstances.getPublicationName());
});

Template.List_Feedback_Instances_Widget.helpers({
  feedbackInstances() {
    const allFeedbackInstances = FeedbackInstances.find().fetch();
    const sortByUser = _.sortBy(allFeedbackInstances, function (fi) {
      return Users.getProfile(fi.userID).username;
    });
    return _.sortBy(sortByUser, function (fi) {
      return fi.functionName;
    });
  },
  count() {
    return FeedbackInstances.count();
  },
  name(feedbackInstance) {
    const username = Users.getProfile(feedbackInstance.userID).username;
    const feedbackName = feedbackInstance.functionName;
    return `${username}-${feedbackName}`;
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(feedbackInstance) {
    return [
      { label: 'Student', value: Users.getFullName(feedbackInstance.userID) },
      { label: 'Function Name', value: feedbackInstance.functionName },
      { label: 'Description', value: feedbackInstance.description },
      { label: 'Type', value: feedbackInstance.feedbackType },
    ];
  },
});

Template.List_Feedback_Instances_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: FeedbackInstances.getPublicationName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
