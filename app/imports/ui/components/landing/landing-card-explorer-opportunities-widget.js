import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Landing_Card_Explorer_Opportunities_Widget.helpers({
  itemCount() {
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    return _.filter(opps, (o) => !o.retired).length;
  },
  opportunities() {
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    return _.filter(opps, (o) => !o.retired);
  },
});
