import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection.js';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';

Template.Student_Selector.helpers({
  userFullName() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return Users.getFullName(user._id);
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
});

Template.Student_Selector.events({
  'click .jsRetrieve': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    const parent = event.target.parentElement;
    let uhId = parent.childNodes[1].value;
    if (uhId.indexOf('-') === -1) {
      uhId = `${uhId.substring(0, 4)}-${uhId.substring(4, 8)}`;
    }
    sessionStorage.CURRENT_UH_ID = uhId;  // eslint-disable-line no-undef
    SessionState.set(sessionKeys.CURRENT_UH_ID, uhId);
    instance.state.set('uhId', uhId);
    const user = Users.getUserFromUhId(uhId);
    if (user) {
      sessionStorage.CURRENT_STUDENT_ID = user._id;  // eslint-disable-line no-undef
      SessionState.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
    } else {
      // do error handling for bad student id.
    }
  },
});

Template.Student_Selector.onCreated(function studentSelectorOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
    if (sessionStorage.CURRENT_UH_ID) {  // eslint-disable-line no-undef
      // eslint-disable-next-line no-undef
      this.state.set(sessionKeys.CURRENT_UH_ID, sessionStorage.CURRENT_UH_ID);
    }
    if (sessionStorage.CURRENT_STUDENT_ID) {  // eslint-disable-line no-undef
      // eslint-disable-next-line no-undef
      this.state.set(sessionKeys.CURRENT_STUDENT_ID, sessionStorage.CURRENT_STUDENT_ID);
    }
  }
});

Template.Student_Selector.onRendered(function studentSelectorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Selector.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});

