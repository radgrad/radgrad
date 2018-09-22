import { Template } from 'meteor/templating';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Landing_Card_Explorer_Plans_Widget.helpers({
  itemCount() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return AcademicPlans.find({ semesterNumber }, { sort: { name: 1 } }).fetch().length;
  },
  plans() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return AcademicPlans.find({ semesterNumber }, { sort: { name: 1 } }).fetch();
  },
});
