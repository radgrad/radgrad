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
  validate: new SimpleSchema({
    name: { type: String },
    slug: { type: String },
    description: { type: String },
    opportunityType: { type: String },
    sponsor: { type: String },
    interests: { type: [String] },
    semesters: { type: [String] },
    ice: { type: Object, blackbox: true },
    eventDate: { type: Date, optional: true },
    independentStudy: { type: Boolean, optional: true },
  }).validator(),
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return Opportunities.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating Opportunities.
 */
export const opportunitiesUpdateMethod = new ValidatedMethod({
  name: 'Opportunities.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    name: { type: String },
    slugID: { type: String },
    description: { type: String },
    opportunityTypeID: { type: SimpleSchema.RegEx.Id },
    sponsorID: { type: SimpleSchema.RegEx.Id },
    interestIDs: { type: [SimpleSchema.RegEx.Id] },
    semesterIDs: { type: [SimpleSchema.RegEx.Id] },
    independentStudy: { type: Boolean },
    // Optional data
    eventDate: { type: Date, optional: true },
    iconURL: { type: SimpleSchema.RegEx.Url, optional: true },
    ice: { type: Object, optional: true, blackbox: true },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
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
