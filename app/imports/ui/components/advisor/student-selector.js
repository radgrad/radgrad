import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Selector.helpers({
  userFullName() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const users = Users.find({ uhID }).fetch();
      if (users.length > 0) {
        return Users.getFullName(users[0]._id);
      }
    }
    return 'Select a student';
  },
  userID() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      return state.get('uhId');
    }
    return '1111-1111';
  },
  isUserSelected() {
    return Template.instance().state.get('uhId');
  },
  roles() {
    const ret = [];
    const pairs = lodash.toPairs(ROLE);
    pairs.forEach((p) => {
      const keyValue = {};
      if (p[1] !== 'ADMIN') {
        keyValue.key = p[1];
        keyValue.value = lodash.capitalize(p[1]);
        ret.push(keyValue);
      }
    });
    return ret;
  },
  inRole(role) {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const users = Users.find({ uhID }).fetch();
      console.log(uhID, users, role.key);
      if (users.length > 0) {
        console.log(Roles.userIsInRole(users[0]._id, role.key));
        return Roles.userIsInRole(users[0]._id, role.key);
      }
    }
    return false;
  },
  userRole() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const users = Users.find({ uhID }).fetch();
      if (users.length > 0) {
        return lodash.capitalize(Users.getRoles(users[0]._id)[0]);
      }
    }
    return 'Select Role';
  }
});

Template.Student_Selector.events({
  // add your events here
});

Template.Student_Selector.onCreated(function studentSelectorOnCreated() {
  this.state = this.data.dictionary;
});

Template.Student_Selector.onRendered(function studentSelectorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Selector.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});

