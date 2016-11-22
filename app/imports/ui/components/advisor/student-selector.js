import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection.js';

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
    // event.preventDefault();  // TODO: Cam, what is the right behavior? go to a new url or not.
    const parent = event.target.parentElement;
    let uhId = parent.childNodes[1].value;
    if (uhId.indexOf('-') === -1) {
      uhId = `${uhId.substring(0, 4)}-${uhId.substring(4, 8)}`;
    }
    instance.state.set('uhId', uhId);
  },
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

