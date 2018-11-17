import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';

Template.Landing_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return _.filter(DesiredDegrees.find({}, { sort: { name: 1 } }).fetch(), (d) => !d.retired);
  },
  degree() {
    const degreeSlugName = FlowRouter.getParam('degree');
    const slug = Slugs.findDoc({ name: degreeSlugName });
    return DesiredDegrees.findDoc({ slugID: slug._id });
  },
  descriptionPairs(degree) {
    return [
      { label: 'Description', value: degree.description },
    ];
  },
  nonAddedDegrees() {
    return [];
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(degree) { // eslint-disable-line
    return [];
  },
});

