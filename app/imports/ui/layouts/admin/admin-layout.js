import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName, regex: 'home' },
      { label: 'Data Model', route: RouteNames.adminDataModelPageRouteName, regex: 'datamodel' },
      { label: 'Data Base', route: RouteNames.adminDataBasePageRouteName, regex: 'database' },
      { label: 'Review Moderation', route: RouteNames.adminReviewModerationPageRouteName,
        regex: 'admin-review-moderation' },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
});
