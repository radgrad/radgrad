import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Help_Messages_Widget.onCreated(function listHelpMessagesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Help_Messages_Widget.helpers({
  helpMessages() {
    const items = HelpMessages.find({}, { sort: { routeName: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return HelpMessages.count();
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(helpMessage) {
    return [
      { label: 'Route Name', value: helpMessage.routeName },
      { label: 'Title', value: helpMessage.title },
      { label: 'Text', value: helpMessage.text },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return HelpMessages;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Help_Messages_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'HelpMessageCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
