import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { _ } from 'meteor/erasaur:meteor-lodash';

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  shortName: { type: String, optional: true },
  number: { type: String, optional: false },
  creditHrs: { type: Number, optional: true, defaultValue: '3' },
  syllabus: { type: String, optional: true },
  moreInformation: { type: String, optional: true },
  description: { type: String, optional: false },
  interestIDs: { type: [String], optional: false, minCount: 1 },
  prerequisites: { type: [String], optional: true },
});

Template.Update_Course_Widget.onCreated(function onCreated() {
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.context = updateSchema.namedContext('update_Widget');
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Update_Course_Widget.onRendered(function addCareerGoalWidgetOnRendered() {
  this.$('.dropdown').dropdown({});
});

Template.Update_Course_Widget.helpers({
  course() {
    return Courses.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(course.slugID).name;
  },
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
  selectedInterestIDs() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return course.interestIDs;
  },
  selectedCourseIDs() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return _.map(course.prerequisites, prerequisite => Courses.findIdBySlug(prerequisite));
  },
  prerequisites() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Update_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const name = event.target.name.value;
    const shortName = event.target.shortName.value;
    const number = event.target.number.value;
    const creditHrs = event.target.creditHrs.value || '3';
    const syllabus = event.target.syllabus.value;
    const moreInformation = event.target.moreInformation.value;
    const description = event.target.description.value;
    // Get Interests (multiple selection)
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interestIDs = _.map(selectedInterests, (option) => option.value);
    // Get Prerequisites (multiple selection)
    const selectedPrerequisites = _.filter(event.target.prerequisites.selectedOptions, (option) => option.selected);
    const prerequisites = _.map(selectedPrerequisites, (option) => option.value);
    const updatedData = { interestIDs, name, shortName, number, creditHrs, syllabus,
      moreInformation, description, prerequisites };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that data reflects what will be inserted.
    updateSchema.clean(updatedData);
    // Determine validity.
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      Courses.update(instance.data.updateID.get(), { $set: updatedData });
      instance.successClass.set('success');
      instance.errorClass.set('');
      event.target.reset();
      instance.$('.dropdown').dropdown('clear');
    } else {
      instance.successClass.set('');
      instance.errorClass.set('error');
    }
  },
  'click .jsCancel': function (event, instance) {
    event.preventDefault();
    instance.data.updateID.set('');
  },
});
