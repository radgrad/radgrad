import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_Analytics_Menu.helpers({
  integrityCheckRouteName() {
    return RouteNames.adminDataBaseIntegrityCheckPageRouteName;
  },
  dumpRouteName() {
    return RouteNames.adminDataBaseDumpPageRouteName;
  },
});
