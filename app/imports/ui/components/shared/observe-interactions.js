import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { userInteractionDefineMethod } from '../../../api/log/UserInteractionCollection.methods';
import { ROLE } from '../../../api/role/Role';

let cursorHandle;

Template.Observe_Interactions.helpers({
  startObserve() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), [ROLE.STUDENT])) {
      const studentDocumentsCursor = StudentProfiles.find({ userID: `${Meteor.userId()}` });
      cursorHandle = studentDocumentsCursor.observeChanges({
        // This assumes that only one field is modified at a time by the student.
        changed: function (id, field) {
          const userID = Meteor.userId();
          const type = Object.keys(field).toString();
          let typeData = Object.values(field).toString();
          if (typeData === '') typeData = 'n/a';
          setTimeout(function () {
            userInteractionDefineMethod.call({ userID, type, typeData }, (error) => {
              if (error) {
                console.log('Error creating UserInteraction.', error);
              }
            });
          }, 0);
        },
      });
    }
  },
});

Template.Observe_Interactions.onDestroyed(function () {
  cursorHandle.stop();
});
