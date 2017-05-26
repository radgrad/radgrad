import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { helpMessagesRemoveItMethodName } from '../../../api/help/HelpMessageCollection.methods';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/List_Help_Messages_Widget */

Template.List_Help_Messages_Widget.helpers({
  helpMessages() {
    return HelpMessages.find({}, { sort: { routeName: 1 } });
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
});

Template.List_Help_Messages_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Meteor.call(helpMessagesRemoveItMethodName, { id });
  },
});
