import { Template } from 'meteor/templating';
import { Interests } from '../../../api/interest/InterestCollection';

Template.Landing_Card_Explorer_Interests_Page.helpers({
  addedInterests() {
    return Interests.find({}, { sort: { name: 1 } }).fetch();
  },
  nonAddedInterests() {
    return [];
  },
});
