import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Landing_Card_Explorer_Plans_Widget.helpers({
  itemCount() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return _.filter(AcademicPlans.find({ semesterNumber }, { sort: { name: 1 } }).fetch(), (ap) => !ap.retired).length;
  },
  plans() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return _.filter(AcademicPlans.find({ semesterNumber }, { sort: { name: 1 } }).fetch(), (ap) => !ap.retired);
  },
});
