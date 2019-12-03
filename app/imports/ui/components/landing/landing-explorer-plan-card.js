import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Landing_Explorer_Plan_Card.helpers({
  academicPlansRouteName() {
    return RouteNames.landingExplorerPlansPageRouteName;
  },
  itemName(item) {
    return item.name;
  },
  itemShortDescription(item) {
    let { description } = item;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
});
