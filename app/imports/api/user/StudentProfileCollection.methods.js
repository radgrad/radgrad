import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ROLE } from '../role/Role';
import { StudentProfiles } from './StudentProfileCollection';
import { Users } from './UserCollection';


function updateAllStudentsSharing() {
  StudentProfiles.find()
    .forEach((s) => {
      StudentProfiles.setSharePicture(s.userID);
    });
  return StudentProfiles.count();
}

export const updateStudentSharingInfoMethod = new ValidatedMethod({
  name: 'StudentProfileCollection.updateSharing',
  validate: null,
  run() {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to update sharing information.',
        Error().stack);
    }
    // Don't update except on server side (disable client-side simulation).
    if (Meteor.isServer) {
      return `Updated ${updateAllStudentsSharing()} sharePicture values.`;
    }
    return null;
  },
});

export const getStudentProfileMethod = new ValidatedMethod({
  name: 'StudentProfileCollection.getStudentProfile',
  validate: null,
  run(username) {
    if (!this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.STUDENT])) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or STUDEN to to get the profile.',
        Error().stack);
    }
    if (Roles.userIsInRole(this.userId, [ROLE.STUDENT]) && Meteor.user('username').username !== username) {
      throw new Meteor.Error('unauthorized', 'You can only get your profile.',
        Error().stack);
    }
    const profile = Users.findProfileFromUsername(username);
    return profile;
  },
});
