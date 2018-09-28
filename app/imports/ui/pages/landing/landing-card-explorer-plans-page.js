import { Template } from 'meteor/templating';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Landing_Card_Explorer_Plans_Page.helpers({
  addedPlans() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return AcademicPlans.find({ semesterNumber }, { sort: { name: 1 } }).fetch();
  },
  nonAddedPlans() {
    return [];
  },
});
