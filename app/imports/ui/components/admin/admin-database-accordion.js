import { Template } from 'meteor/templating';

Template.Admin_DataBase_Accordion.onRendered(function listCareerGoalsWidgetOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.Admin_DataBase_Accordion.helpers({
  prettyPrint(contents) {
    let returnString = '';
    contents.forEach(function (entry) {
      returnString += `${JSON.stringify(entry, null, 0)}\n`;
    });
    return returnString;
  },
  length(contents) {
    return contents.length;
  },
});
