import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.First_Menu_Ice.helpers({
  pClass(value) {
    return (value <= 100) ? `p${value}` : 'p100';
  },
  finalEarned(value) {
    return (value <= 100) ? value : 100;
  },
  iceRouteName() {
    return RouteNames.studentHomeIcePageRouteName;
  },
  equalTo(type) {
    return this.type === type;
  },
});
