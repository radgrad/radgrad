import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { userInteractionDefineMethod } from '../../../api/log/UserInteractionCollection.methods';

let cursorHandle;

Template.Observe_Interactions.helpers({
  startObserve() {
    console.log('startObserve started!');
    if (Meteor.userId()) {
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
  console.log('stopped observeChanges');
});
