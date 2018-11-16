import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import * as FormUtils from '../form-fields/form-field-utilities';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const addSchema = new SimpleSchema({
  slug: String,
  desiredDegree: String,
  name: String,
  description: String,
  semester: String,
  coursesPerSemester: String,
  courseList: String,
}, { tracker: Tracker });

Template.Add_Academic_Plan_Widget.onCreated(function addacademicplanwidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Academic_Plan_Widget.helpers({
  desiredDegrees() {
    return _.filter(DesiredDegrees.find({}, { sort: { name: 1 } }).fetch(), (d) => !d.retired);
  },
  selectedDesiredDegreeID() {
    return '';
  },
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: 1 } });
  },
  selectedSemesterID() {
    return '';
  },
});

Template.Add_Academic_Plan_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    // console.log(newData);
    instance.context.validate(newData);
    const degree = DesiredDegrees.findDoc(newData.desiredDegree);
    const degreeSlug = Slugs.getNameFromID(degree.slugID);
    newData.degreeSlug = degreeSlug;
    const numberStrings = newData.coursesPerSemester.split(', ');
    const coursesPerSemester = _.map(numberStrings, (s) => parseInt(s, 10));
    newData.coursesPerSemester = coursesPerSemester;
    newData.courseList = newData.courseList.split(', ');
    // console.log(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: AcademicPlans.getCollectionName(), definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
