import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Card_Explorer_Degrees_Widget.helpers({
  degrees() {
    return DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
  },
  itemCount() {
    return DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }).length;
  },
});
