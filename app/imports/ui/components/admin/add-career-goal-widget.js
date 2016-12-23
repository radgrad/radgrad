import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Add_Career_Goal_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
  this.$('.dropdown').dropdown({});
});

/**
 * Custom validator for the slug field.
 * @returns True if the slug value is not previously defined, otherwise errorType 'duplicateSlug'.
 */
function slugFieldValidator() {
  return (Slugs.isDefined(this.value)) ? 'duplicateSlug' : true;
}

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: slugFieldValidator },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

addSchema.messages({ duplicateSlug: 'The slug [value] is already defined.' });

Template.Add_Career_Goal_Widget.onCreated(function onCreated() {
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.context = addSchema.namedContext('Add_Widget');
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Add_Career_Goal_Widget.helpers({
  successClass() {
    return Template.instance().successClass.get();
  },
  errorClass() {
    return Template.instance().errorClass.get();
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
});

Template.Add_Career_Goal_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const name = event.target.name.value;
    const slug = event.target.slug.value;
    const moreInformation = event.target.moreInformation.value;
    const description = event.target.description.value;
    // Get Interests (multiple selection)
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    const newData = { name, slug, moreInformation, description, interests };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    addSchema.clean(newData);
    // Determine validity.
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      CareerGoals.define(newData);
      instance.successClass.set('success');
      instance.errorClass.set('');
      event.target.reset();
    } else {
      instance.successClass.set('');
      instance.errorClass.set('error');
    }
  },
});
