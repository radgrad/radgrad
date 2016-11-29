import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
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
    const user = Users.getUserFromUhId(uhId);
    if (user) {
      const adminID = Meteor.userId();
      if (AdminChoices.find({ adminID: Meteor.userId() }).count() === 1) {
        const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
        AdminChoices.updateUHID(adminChoice._id, uhId);
        AdminChoices.updateStudentID(adminChoice._id, user._id);
      }
      SessionState.set(sessionKeys.CURRENT_UH_ID, uhId);
      instance.state.set('uhId', uhId);
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
    const adminID = Meteor.userId();
    if (AdminChoices.find({ adminID }).count() === 1) {
      const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
      this.state.set(sessionKeys.CURRENT_UH_ID, adminChoice.uhID);
      this.state.set(sessionKeys.CURRENT_STUDENT_ID, adminChoice.studentID);
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

