import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Interests } from '../../../api/interest/InterestCollection';

Template.Landing_Interest_List.helpers({
  item() {
    return Template.currentData().item;
  },
  itemInterests(item) {
    return _.map(item.interestIDs, (id) => Interests.findDoc(id));
  },
  size() {
    return Template.currentData().size;
  },
  interestName(interest) {
    return interest.name;
  },
  interestsRouteName() {
    return RouteNames.landingExplorerInterestsPageRouteName;
  },
  interestSlug(interest) {
    return Slugs.findDoc(interest.slugID).name;
  },
});
