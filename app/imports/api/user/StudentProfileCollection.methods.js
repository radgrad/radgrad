import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ROLE } from '../role/Role';
import { StudentProfiles } from './StudentProfileCollection';


function updateAllStudentsSharing() {
  StudentProfiles.find().forEach((s) => { StudentProfiles.setSharePicture(s.userID); });
  return StudentProfiles.count();
}

export const updateStudentSharingInfoMethod = new ValidatedMethod({
  name: 'StudentProfileCollection.updateSharing',
  validate: null,
  run() {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.',
        Error().stack);
    }
    // Don't update except on server side (disable client-side simulation).
    if (Meteor.isServer) {
      return `Updated ${updateAllStudentsSharing()} sharePicture values.`;
    }
    return null;
  },
});
