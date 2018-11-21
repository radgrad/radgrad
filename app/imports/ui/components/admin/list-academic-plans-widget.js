import { Template } from 'meteor/templating';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';

function numReferences(academicPlan) {
  let references = 0;
  Users.findProfiles().forEach(function (profile) {
    if (profile.academicPlanID === academicPlan._id) {
      references += 1;
    }
  });
  return references;
}

Template.List_Academic_Plans_Widget.helpers({
  academicPlans() {
    return AcademicPlans.find({}, { sort: { year: 1, name: 1 } }).fetch();
  },
  count() {
    return AcademicPlans.find({}, { sort: { year: 1, name: 1 } }).fetch().length;
  },
  deleteDisabled(academicPlan) {
    return (numReferences(academicPlan) > 0) ? 'disabled' : '';
  },
  updateDisabled() {
    return false;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(academicPlan) {
    return [
      { label: 'Name', value: `${academicPlan.name}` },
      { label: 'Description', value: academicPlan.description },
      { label: 'Semester', value: Semesters.toString(academicPlan.effectiveSemesterID) },
      { label: 'References', value: `Students: ${numReferences(academicPlan)}` },
      { label: 'Retired', value: academicPlan.retired ? 'True' : 'False' }];
  },
});

Template.List_Academic_Plans_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'AcademicPlanCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

Template.List_Academic_Plans_Widget.onRendered(function listacademicplanswidgetOnRendered() {
  // add your statement here
});

Template.List_Academic_Plans_Widget.onDestroyed(function listacademicplanswidgetOnDestroyed() {
  // add your statement here
});

