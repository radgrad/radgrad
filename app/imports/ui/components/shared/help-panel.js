import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { HelpInstances } from '../../../api/help/HelpInstanceCollection';
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
  showHelp() {
    const routeName = FlowRouter.getRouteName();
    const studentID = Meteor.userId();
    if (HelpInstances.findOne(routeName, studentID)) {
      return false;
    }
    return true;
  },
});

Template.Help_Panel.events({
  'click .close.icon': function clickCloseIcon(event) {
    event.preventDefault();
    const routeName = FlowRouter.getRouteName();
    const studentID = Meteor.userId();
    HelpInstances.define({ routeName, studentID });
  },
  'click .jsResetHelp': function clickResetHelp(event) {
    event.preventDefault();
    HelpInstances.resetChoice(Meteor.userId());
    Tracker.afterFlush(() => {
      // Use Tracker.afterFlush to guarantee that the DOM is re-rendered before calling JQuery.
      Template.instance().$('.ui.accordion').accordion('close', 0);
    });
  },
});

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

