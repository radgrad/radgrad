import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection';

Template.Faculty_Selector.helpers({
  facultyFullName(faculty) {
    if (faculty) {
      return `${faculty.firstName} ${faculty.lastName}`;
    }
    return '';
  },
  facultySelected(faculty) {
    if (faculty && Template.instance().state) {
      return faculty._id === Template.instance().state.get(sessionKeys.CURRENT_FACULTY_ID);
    }
    return false;
  },
  userFullName() {
    if (SessionState && SessionState.get(sessionKeys.CURRENT_FACULTY_ID)) {
      return Users.getFullName(SessionState.get(sessionKeys.CURRENT_FACULTY_ID));
    }
    return 'Select an faculty';
  },
  allFaculty() {
    const ret = [];
    const users = Users.find().fetch();
    users.forEach((u) => {
      if (Roles.userIsInRole(u._id, 'FACULTY')) {
        ret.push(u);
      }
    });
    return ret;
  },
});

Template.Faculty_Selector.events({
  'click .jsFacultyRetrieve': function clickJSRetrieve(event) {
    event.preventDefault();
    const advisorDivs = event.target.parentElement.getElementsByTagName('a');
    const advisorID = advisorDivs[0].attributes[1].nodeValue;
    const user = Users.findDoc(advisorID);
    if (user) {
      sessionStorage.CURRENT_FACULTY_ID = user._id;  // eslint-disable-line no-undef
      SessionState.set(sessionKeys.CURRENT_FACULTY_ID, user._id);
    } else {
      // do error handling for bad student id.
    }
  },
});

Template.Faculty_Selector.onCreated(function facultySelectorOnCreated() {
  this.state = new ReactiveDict();
});

Template.Faculty_Selector.onRendered(function facultySelectorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Faculty_Selector.onDestroyed(function facultySelectorOnDestroyed() {
  // add your statement here
});

