import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection';

Template.Advisor_Selector.helpers({
  advisorFullName(advisor) {
    if (advisor) {
      return `${advisor.firstName} ${advisor.lastName}`;
    }
    return '';
  },
  advisorSelected(advisor) {
    if (advisor && Template.instance().state) {
      return advisor._id === Template.instance().state.get(sessionKeys.CURRENT_ADVISOR_ID);
    }
    return false;
  },
  userFullName() {
    if (SessionState && SessionState.get(sessionKeys.CURRENT_ADVISOR_ID)) {
      return Users.getFullName(SessionState.get(sessionKeys.CURRENT_ADVISOR_ID));
    }
    return 'Select an Advisor';
  },
  advisors() {
    const ret = [];
    const users = Users.find().fetch();
    users.forEach((u) => {
      if (Roles.userIsInRole(u._id, 'ADVISOR')) {
        ret.push(u);
      }
    });
    return ret;
  },
});

Template.Advisor_Selector.events({
  'click .jsAdvisorRetrieve': function clickJSRetrieve(event) {
    event.preventDefault();
    const advisorDivs = event.target.parentElement.getElementsByTagName('a');
    const advisorID = advisorDivs[0].attributes[1].nodeValue;
    const user = Users.findDoc(advisorID);
    const adminID = Meteor.userId();
    const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
    if (user) {
      Meteor.call('Collection.update', {
        collectionName: 'AdminChoices',
        id: adminChoice._id,
        modifier: { advisorID },
      });
      SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, user._id);
    } else {
      // do error handling for bad student id.
    }
  },
});

Template.Advisor_Selector.onCreated(function advisorSelectorOnCreated() {
  this.state = new ReactiveDict();
});

Template.Advisor_Selector.onRendered(function advisorSelectorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Advisor_Selector.onDestroyed(function advisorSelectorOnDestroyed() {
  // add your statement here
});

