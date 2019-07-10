import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Feedback_Instances_Widget.onCreated(function onCreated() {
  // this.subscribe(FeedbackInstances.getPublicationName());
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Feedback_Instances_Widget.helpers({
  feedbackInstances() {
    const allFeedbackInstances = FeedbackInstances.find().fetch();
    const sortByUser = _.sortBy(allFeedbackInstances, function (fi) {
      return Users.getProfile(fi.userID).username;
    });
    const items = _.sortBy(sortByUser, function (fi) {
      return fi.functionName;
    });
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
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
      { label: 'Retired', value: feedbackInstance.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return FeedbackInstances;
  },
  retired(item) {
    return item.retired;
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
