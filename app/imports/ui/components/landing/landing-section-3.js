import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Landing_Section_3.helpers({
  careerGoalsRouteName() {
    return RouteNames.landingCardExplorerCareerGoalsPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.landingCardExplorerInterestsPageRouteName;
  },
});
