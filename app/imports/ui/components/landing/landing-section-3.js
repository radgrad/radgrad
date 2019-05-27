import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Landing_Section_3.helpers({
  careerGoalsRouteName() {
    return RouteNames.landingCardExplorerCareerGoalsPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.landingCardExplorerDegreesPageRouteName;
  },
  firstInterest() {
    let ret = 'dotNet';
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  },
  interestsRouteName() {
    return RouteNames.landingExplorerInterestsPageRouteName;
  },
});
