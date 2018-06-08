import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Showdown } from 'meteor/markdown';
import { Slugs } from '../../../api/slug/SlugCollection.js';

/**
 * Given a Simple Schema and a field, return true if that field is of type Array.
 * @param schema The simple schema definition.
 * @param field The field of interest.
 * @returns {boolean} True if the field is of type array.
 * @memberOf ui/components/form-fields
 */
function isSchemaFieldArray(schema, field) {
  return schema.schema(field).type.definitions[0].type.name === 'Array';
}

/**
 * Return the data from the submitted form corresponding to the fields in the passed schema.
 * @param schema The simple schema.
 * @param event The event holding the form data.
 * @returns {Object} An object whose keys are the schema keys and whose values are the corresponding form values.
 * @memberOf ui/components/form-fields
 */
export function getSchemaDataFromEvent(schema, event) {
  const eventData = {};
  _.forEach(schema._firstLevelSchemaKeys, function (key) {
    // console.log(key);
    if (isSchemaFieldArray(schema, key)) {
      const selectedValues = _.filter(event.target[key].selectedOptions, (option) => option.selected);
      eventData[key] = _.map(selectedValues, (option) => option.value);
    } else {
      eventData[key] = event.target[key].value;
    }
  });
  return eventData;
}

/**
 * Custom validator for the slug field.
 * @returns True if the slug value is not previously defined, otherwise errorType 'duplicateSlug'.
 * @throws Error if there are no Slugs in the SlugCollection.
 * @memberOf ui/components/form-fields
 */
export function slugFieldValidator() {
  if (Slugs.count() === 0) {
    throw Meteor.Error('slugFieldValidator called but SlugCollection is empty. Probably not subscribed to.');
  }
  return (Slugs.isDefined(this.value)) ? 'duplicateSlug' : true;
}

/* eslint-disable no-param-reassign */

/**
 * Rename oldKey in obj to newKey.
 * @param obj The object containing oldKey
 * @param oldKey The oldKey (a string).
 * @param newKey The newKey (a string).
 * @memberOf ui/components/form-fields
 */
export function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

/**
 * Convert ICE values from three fields to a single 'ice' field with an object value.
 * @param obj The data object holding ICE values as three separate fields.
 * @memberOf ui/components/form-fields
 */
export function convertICE(obj) {
  obj.ice = { i: obj.innovation, c: obj.competency, e: obj.experience };
  delete obj.innovation;
  delete obj.competency;
  delete obj.experience;
}

/**
 * Add successClass, errorClass, and context to the template.
 * @param instance The template instance.
 * @param schema The schema associated with the form in this instance.
 * @memberOf ui/components/form-fields
 */
export function setupFormWidget(instance, schema) {
  instance.successClass = new ReactiveVar('');
  instance.errorClass = new ReactiveVar('');
  instance.context = schema.namedContext('widget');
  // do this just in case the schema has a slug. Not always needed but does no harm.
  schema.messageBox.messages({ duplicateSlug: 'The slug {{value}} is already defined.' });
}

/**
 * After a form submission has completed successfully, update template state to indicate success.
 * @param instance The template instance.
 * @param event The event holding the form data.
 * @memberOf ui/components/form-fields
 */
export function indicateSuccess(instance, event) {
  instance.successClass.set('success');
  instance.errorClass.set('');
  event.target.reset();
  instance.$('.dropdown').dropdown('clear');
}

/**
 * If a form submission was not validated, update template state to indicate error.
 * @param instance The template instance.
 * @memberOf ui/components/form-fields
 */
export function indicateError(instance, error) {
  if (instance.errorClass) {
    instance.errorClass.set('error');
  }
  if (instance.successClass) {
    instance.successClass.set('');
  }
  if (error) {
    console.log(`Error: ${error}`);
  }
}

export function processCancelButtonClick(event, instance) {
  event.preventDefault();
  instance.data.updateID.set('');
}

export function processUpdateButtonClick(event, instance) {
  event.preventDefault();
  const id = event.target.value;
  instance.data.updateID.set(id);
}

/*
 * Register common helper classes for form processing.
 */
Template.registerHelper('successClass', () => Template.instance().successClass.get());
Template.registerHelper('errorClass', () => Template.instance().errorClass.get());
Template.registerHelper('fieldError', (fieldName) => {
  const invalidKeys = Template.instance().context.validationErrors();
  const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
  return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
});

/**
 * Helper for markdown processing. Takes a string in markdown format and returns it as HTML.
 * Call this within triple curly braces to insert markdown.
 */
/* eslint-disable new-cap */
Template.registerHelper('markdownify', text => new Showdown.converter().makeHtml(text));
