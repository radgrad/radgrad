import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Slugs } from './SlugCollection';

/* eslint object-shorthand: "off" */

/**
 * The Slug collection define validated method.
 */
export const defineSlugMethod = new ValidatedMethod({
  name: 'Slugs.define',
  validate: new SimpleSchema({
    name: { type: String, optional: false },
    entityName: { type: String, optional: false },
  }).validator(),
  run({ name, entityName }) {
    Slugs.define(name, entityName);
  },
});

/**
 * The Slug collection define validated method.
 */
export const removeSlugMethod = new ValidatedMethod({
  name: 'Slugs.remove',
  validate: new SimpleSchema({
    name: { type: String },
    entityName: { type: String },
    entityID: { type: SimpleSchema.RegEx.Id, optional: true },
  }).validator(),
  run(slug) {
    Slugs.removeIt(slug);
  },
});

// Meteor.methods({
//   'SlugCollection._removeAll'() {
//     Slugs._removeAll();
//   },
// });
