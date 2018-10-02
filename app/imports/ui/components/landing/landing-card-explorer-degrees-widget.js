import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Landing_Card_Explorer_Degrees_Widget.helpers({
  degrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
  },
  itemCount() {
    return DesiredDegrees.find({}, { sort: { name: 1 } }).fetch().length;
  },
});
