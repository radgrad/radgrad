import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Landing_Card_Explorer_Opportunities_Widget.helpers({
  itemCount() {
    return Opportunities.findNonRetired({}, { sort: { name: 1 } }).length;
  },
  opportunities() {
    return Opportunities.findNonRetired({}, { sort: { name: 1 } });
  },
});
