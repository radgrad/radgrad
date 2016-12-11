/**
 * Created by Cam on 12/11/2016.
 */
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod, ValidationError } from 'meteor/mdg:validated-method';
import { CollectionDictionary } from '../../startup/both/collection-dictionary';

export const define = new ValidatedMethod({
  name: 'Collection.define',
  validate(args) {
    const errors = [];
    const collection = CollectionDictionary[args.collectionName];
    if (collection == null) {
      errors.push({
        name: 'Collection.update',
        type: 'define-validation-fail',
        details: {
          collection: `Unknown Collection ${args.collectionName}`,
        },
      });
    }
    const defineSchemaContext = collection._defineSchema.namedContext('validateDefine');
    if (!defineSchemaContext.validate(args.doc)) {
      errors.push({
        name: 'Collection.define',
        type: 'define-validation-fail',
        details: {
          doc: args.doc,
        },
      });
    }
    if (errors.length) {
      throw new ValidationError(errors);
    }
  },
  run(args) {
    const collection = CollectionDictionary[args.collectionName];
    if (collection == null) {
      throw new Meteor.Error(`Unknown Collection ${args.collectionName}`);
    }
    return collection.define(args.doc);
  },
});

export const update = new ValidatedMethod({
  name: 'Collection.update',
  validate(args) {
    const collection = CollectionDictionary[args.collectionName];
    const errors = [];
    if (collection == null) {
      errors.push({
        name: 'Collection.update',
        type: 'update-validation-fail',
        details: {
          collection: `Unknown Collection ${args.collectionName}`,
        },
      });
    }
    if (!args.id) {
      errors.push({
        name: 'Collection.update',
        type: 'update-validation-fail',
        details: {
          id: 'No ID.',
        },
      });
    }
    if (!args.modifier) {
      errors.push({
        name: 'Collection.update',
        type: 'update-validation-fail',
        details: {
          collection: 'No modifier.',
        },
      });
    }
    if (errors.length) {
      throw new ValidationError(errors);
    }
  },
  run(args) {
    const collection = CollectionDictionary[args.collectionName];
    if (collection == null) {
      throw new Meteor.Error(`Unknown Collection ${args.collectionName}`);
    }
    const modifier = args.modifier;
    return collection.update({ _id: args.id }, { $set: modifier });
  },
});

export const remove = new ValidatedMethod({
  name: 'Collection.remove',
  validate(args) {
    const collection = CollectionDictionary[args.collectionName];
    const errors = [];
    if (collection == null) {
      errors.push({
        name: 'Collection.remove',
        type: 'remove-validation-fail',
        details: {
          collection: `Unknown Collection ${args.collectionName}`,
        },
      });
    }
    if (!args.id) {
      errors.push({
        name: 'Collection.remove',
        type: 'remove-validation-fail',
        details: {
          id: 'No ID.',
        },
      });
    }
    if (errors.length) {
      throw new ValidationError(errors);
    }
  },
  run(args) {
    const collection = CollectionDictionary[args.collectionName];
    if (collection == null) {
      throw new Meteor.Error(`Unknown Collection ${args.collectionName}`);
    }
    return collection.remove({ _id: args.id });
  },
});
