import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Users } from '../../../api/user/UserCollection';

function numReferences(academicYearInstance) { // eslint-disable-line
  return 0;
}

Template.List_Academic_Year_Instances_Widget.helpers({
  academicYearInstances() {
    return AcademicYearInstances.find({}, { sort: { year: 1 } });
  },
  count() {
    return AcademicYearInstances.count();
  },
  deleteDisabled(academicYearInstance) {
    return (numReferences(academicYearInstance) > 0) ? 'disabled' : '';
  },
  name(academicYearInstance) {
    return `${Users.getFullName(academicYearInstance.studentID)} ${academicYearInstance.year}`;
  },
  descriptionPairs(academicYearInstance) {
    return [
      { label: 'Year', value: `${academicYearInstance.year}` },
      { label: 'Description', value: Users.getFullName(academicYearInstance.studentID) },
    ];
  },
});
