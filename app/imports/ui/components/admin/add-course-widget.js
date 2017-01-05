import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  shortName: { type: String, optional: true },
  number: { type: String, optional: false },
  creditHrs: { type: Number, optional: true, defaultValue: 3 },
  syllabus: { type: String, optional: true },
  moreInformation: { type: String, optional: true },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  prerequisites: { type: [String], optional: true },
});

Template.Add_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Add_Course_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Add_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      Courses.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
