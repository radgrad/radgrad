import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';

Template.Third_Menu.helpers({
  thirdMenuFullName() {
    let id;
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    } else if (SessionState.get(sessionKeys.CURRENT_ADVISOR_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_ADVISOR_ID);
    } else if (SessionState.get(sessionKeys.CURRENT_FACULTY_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_FACULTY_ID);
    }
    if (id) {
      try {
        return Users.getFullName(id);
      } catch (e) {
        return '';
      }
    }
    return '';
  },
});

Template.Third_Menu.events({

});

Template.Third_Menu.onCreated(function thirdMenuOnCreated() {
  // add your statement here
});

Template.Third_Menu.onRendered(function thirdMenuOnRendered() {
  // this.$('a.ui.right.dropdown.item').dropdown({
  //   on: 'hover',
  // });
});

Template.Third_Menu.onDestroyed(function thirdMenuOnDestroyed() {
  // add your statement here
});

