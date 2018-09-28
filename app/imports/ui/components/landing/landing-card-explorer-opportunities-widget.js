import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Landing_Card_Explorer_Opportunities_Widget.helpers({
  itemCount() {
    return Opportunities.find({}, { sort: { name: 1 } }).fetch().length;
  },
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } }).fetch();
  },
});
