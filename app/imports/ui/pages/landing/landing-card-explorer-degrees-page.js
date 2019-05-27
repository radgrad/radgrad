import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Landing_Card_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
  },
  nonAddedDegrees() {
    return [];
  },
});
