import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './UserCollection';

// TODO: Centralize schemas. Currently three: (1) here, (2) admin UI, (3) UserCollection definition.

export const defineUser = new ValidatedMethod({
  name: 'Users.define',
  validate: new SimpleSchema({
    firstName: { type: String, optional: false },
    lastName: { type: String, optional: false },
    role: { type: String, optional: false },
    slug: { type: String, optional: false },
    email: { type: String, optional: false },
    uhID: { type: String, optional: false },
    // remaining are optional.
    password: { type: String, optional: true },
    desiredDegree: { type: String, optional: true },
    picture: { type: String, optional: true },
    level: { type: Number, optional: true },
    careerGoals: { type: [String], optional: true },
    interests: { type: [String], optional: true },
    website: { type: String, optional: true },
  }).validator(),
  run(userDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Users.');
    }
    const studentID = Users.define(userDefn);
    return studentID;
  },
});

export const updateUser = new ValidatedMethod({
  name: 'Users.update',
  validate: new SimpleSchema({
    firstName: { type: String, optional: false },
    lastName: { type: String, optional: false },
    username: { type: String, optional: false },
    role: { type: String, optional: false },
    email: { type: String, optional: false },
    uhID: { type: String, optional: false },
    // remaining are optional.
    desiredDegreeID: { type: String, optional: true },
    picture: { type: String, optional: true },
    level: { type: Number, optional: true },
    careerGoalIDs: { type: [String], optional: true },
    interestIDs: { type: [String], optional: true },
    website: { type: String, optional: true },
    declaredSemesterID: { type: SimpleSchema.RegEx.Id, optional: true },
    academicPlanID: { type: SimpleSchema.RegEx.Id, optional: true },
  }).validator(),
  run(userDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Users.');
    } else if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Users.');
    }
    return Users.update(userDefn);
  },
});
