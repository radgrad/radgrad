import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

Template.Landing_Card_Explorer_CareerGoals_Widget.helpers({
  careers() {
    return CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  },
  itemCount() {
    return CareerGoals.find().fetch().length;
  },
});
