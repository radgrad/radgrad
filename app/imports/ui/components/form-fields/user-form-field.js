import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';


Template.User_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.User_Form_Field.helpers({
  isSelected(user, selectedUser) {
    return user === selectedUser;
  },
  name(user) {
    return Users.getFullName(user.username);
  },
});
