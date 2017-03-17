import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

Template.Help_Panel_Widget.helpers({
  helpText() {
    const routeName = FlowRouter.getRouteName();
    const help = HelpMessages.find({ routeName }).fetch();
    if (help.length > 0) {
      return help[0].text;
    }
    return '';
  },
  helpTitle() {
    const routeName = FlowRouter.getRouteName();
    const help = HelpMessages.find({ routeName }).fetch();
    if (help.length > 0) {
      return help[0].title;
    }
    return '';
  },
});

Template.Help_Panel_Widget.onCreated(function helpPanelOnCreated() {
  this.subscribe(HelpMessages.getPublicationName());
});

Template.Help_Panel_Widget.onRendered(function helpPanelOnRendered() {
  this.$('.ui.accordion').accordion();
});
