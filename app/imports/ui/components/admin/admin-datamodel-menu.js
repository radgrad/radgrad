import { Template } from 'meteor/templating';
import { adminDataModelCareerGoalsPageRouteName } from '/imports/startup/client/router.js';

Template.Admin_DataModel_Menu.helpers({
  careerGoalsRouteName() {
    return adminDataModelCareerGoalsPageRouteName;
  },
});
