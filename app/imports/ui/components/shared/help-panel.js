import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

Template.Help_Panel.helpers({
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

Template.Help_Panel.events({});

Template.Help_Panel.onCreated(function helpPanelOnCreated() {
  this.autorun(() => {
    this.subscribe(HelpMessages.getPublicationName());
  });
});

Template.Help_Panel.onRendered(function helpPanelOnRendered() {
  this.$('.ui.accordion').accordion('close', 0);
});

Template.Help_Panel.onDestroyed(function helpPanelOnDestroyed() {
  // add your statement here
});

