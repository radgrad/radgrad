import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Opportunities } from './OpportunityCollection';
import { ROLE } from '../role/Role';

/** @module api/opportunity/OpportunityCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const opportunitiesDefineMethod = new ValidatedMethod({
  name: 'Opportunities.define',
  validate: null,
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Opportunities.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Opportunities.');
      }
    return Opportunities.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating Opportunities.
 */
export const opportunitiesUpdateMethod = new ValidatedMethod({
  name: 'Opportunities.update',
  validate: null,
  run(goalUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Opportunities.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Opportunities.');
      }
    return Opportunities.update(goalUpdate.id, { $set: goalUpdate });
  },
});

/**
 * The ValidatedMethod for removing Opportunities.
 */
export const opportunitiesRemoveItMethod = new ValidatedMethod({
  name: 'Opportunities.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Opportunities.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Opportunities.');
      }
    return Opportunities.removeIt(removeArgs.id);
  },
});
