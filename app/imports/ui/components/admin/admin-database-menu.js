import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_DataBase_Menu.helpers({
  integrityCheckRouteName() {
    return RouteNames.adminDataBaseIntegrityCheckPageRouteName;
  },
  dumpRouteName() {
    return RouteNames.adminDataBaseDumpPageRouteName;
  },
});
