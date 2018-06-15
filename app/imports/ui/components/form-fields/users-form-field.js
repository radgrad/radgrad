import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection';

Template.Users_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Users_Form_Field.helpers({
  isSelected(userID, selectedUserIDs) {
    return _.includes(selectedUserIDs, userID);
  },
  name(user) {
    return Users.getFullName(user.username);
  },
});
