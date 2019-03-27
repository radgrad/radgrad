import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Card_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({ item: d, count: 1 }));
  },
  nonAddedDegrees() {
    return [];
  },
});
