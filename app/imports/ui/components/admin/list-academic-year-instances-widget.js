import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Users } from '../../../api/user/UserCollection';

function numReferences(academicYearInstance) { // eslint-disable-line
  return 0;
}

Template.List_Academic_Year_Instances_Widget.helpers({
  academicYearInstances() {
    const allInstances = AcademicYearInstances.find({}).fetch();
    const sortByYear = _.sortBy(allInstances, function (ayi) {
      return ayi.year;
    });
    return _.sortBy(sortByYear, function (ayi) {
      return Users.getProfile(ayi.studentID).username;
    });
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
      { label: 'Student', value: Users.getFullName(academicYearInstance.studentID) },
      { label: 'Year', value: `${academicYearInstance.year}` },
    ];
  },
});
