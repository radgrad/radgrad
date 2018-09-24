import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Card_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
  },
  nonAddedDegrees() {
    return [];
  },
});
