import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Course_Widget */

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  shortName: { type: String, optional: true },
  number: { type: String, optional: false },
  creditHrs: { type: Number, optional: true, defaultValue: 3 },
  syllabus: { type: String, optional: true },
  moreInformation: { type: String, optional: true },
  description: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  prerequisites: { type: [String], optional: true },
});

Template.Update_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Course_Widget.helpers({
  course() {
    return Courses.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(course.slugID).name;
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
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
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      Courses.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
