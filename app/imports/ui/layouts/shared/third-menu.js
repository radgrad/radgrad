import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';

Template.Third_Menu.helpers({
  thirdMenuFullName() {
    const role = Template.instance().data.role;
    let id;
    if (role && role === 'Student' && SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    } else if (role && role === 'Advisor' && SessionState.get(sessionKeys.CURRENT_ADVISOR_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_ADVISOR_ID);
    } else if (role && role === 'Faculty' && SessionState.get(sessionKeys.CURRENT_FACULTY_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_FACULTY_ID);
    } else if (role && role === 'Mentor' && SessionState.get(sessionKeys.CURRENT_MENTOR_ID)) {
      id = SessionState.get(sessionKeys.CURRENT_MENTOR_ID);
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

