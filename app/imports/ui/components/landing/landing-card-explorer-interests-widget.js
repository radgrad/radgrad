import { Template } from 'meteor/templating';
import { Interests } from '../../../api/interest/InterestCollection';

Template.Landing_Card_Explorer_Interests_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } }).fetch();
  },
  itemCount() {
    return Interests.find({}, { sort: { name: 1 } }).fetch().length;
  },
});
