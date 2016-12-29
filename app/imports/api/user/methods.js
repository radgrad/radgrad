import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './UserCollection';

export const defineUser = new ValidatedMethod({
  name: 'Users.define',
  validate: new SimpleSchema({
    firstName: { type: String },
    lastName: { type: String },
    slug: { type: String },
    email: { type: String },
    role: { type: String },
    uhID: { type: String },
  }).validator(),
  run(userDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Users.');
    }
    const studentID = Users.define(userDefn);
    Users.setUhId(studentID, userDefn.uhID);
    return studentID;
  },
});

