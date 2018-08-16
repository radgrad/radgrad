import { Template } from 'meteor/templating';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

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
    return AcademicPlans.find({}, { sort: { year: 1, name: 1 } });
  },
  count() {
    return AcademicPlans.count();
  },
  deleteDisabled(academicPlan) {
    return (numReferences(academicPlan) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(academicPlan) {
    return [
      { label: 'Name', value: `${academicPlan.name}` },
      { label: 'Description', value: academicPlan.description },
      { label: 'References', value: `Students: ${numReferences(academicPlan)}` }];
  },
});

Template.List_Academic_Plans_Widget.events({
  // add your events here
});

Template.List_Academic_Plans_Widget.onRendered(function listacademicplanswidgetOnRendered() {
  // add your statement here
});

Template.List_Academic_Plans_Widget.onDestroyed(function listacademicplanswidgetOnDestroyed() {
  // add your statement here
});

