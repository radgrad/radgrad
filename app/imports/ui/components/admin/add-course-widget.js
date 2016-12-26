import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Add_Course_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
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
  shortName: { type: String, optional: true },
  number: { type: String, optional: false },
  creditHrs: { type: Number, optional: true, defaultValue: '3' },
  syllabus: { type: String, optional: true },
  moreInformation: { type: String, optional: true },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
});

addSchema.messages({ duplicateSlug: 'The slug [value] is already defined.' });

Template.Add_Course_Widget.onCreated(function onCreated() {
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.context = addSchema.namedContext('Add_Widget');
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Add_Course_Widget.helpers({
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

Template.Add_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const name = event.target.name.value;
    const slug = event.target.slug.value;
    const shortName = event.target.shortName.value;
    const number = event.target.number.value;
    const creditHrs = event.target.creditHrs.value;
    const syllabus = event.target.syllabus.value;
    const moreInformation = event.target.moreInformation.value;
    const description = event.target.description.value;
    // Get Interests (multiple selection)
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    const newData = { name, slug, shortName, number, creditHrs, syllabus, moreInformation, description, interests };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newData reflects what will be inserted.
    addSchema.clean(newData);
    // Determine validity.
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      Course.define(newData);
      instance.successClass.set('success');
      instance.errorClass.set('');
      event.target.reset();
    } else {
      instance.successClass.set('');
      instance.errorClass.set('error');
    }
  },
});
