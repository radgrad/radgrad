import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { appLog } from '../../../api/log/AppLogCollection';

Template.Landing_Explorer_Plans_Widget.onCreated(function studentExplorerPlansWidgetOnCreated() {
  this.planVar = new ReactiveVar();
});

Template.Landing_Explorer_Plans_Widget.helpers({
  toUpper(string) {
    return string.toUpperCase();
  },
  plans() {
    const profile = Users.getProfile(getRouteUserName());
    let semesterNumber;
    if (profile.academicPlanID) {
      semesterNumber = AcademicPlans.findDoc(profile.academicPlanID).semesterNumber;
    }
    const degree = DesiredDegrees.findDoc({ name: Template.instance().data.name });
    const plans = AcademicPlans.getPlansForDegree(degree._id, semesterNumber);
    return plans;
  },
  planVar() {
    return Template.instance().planVar;
  },
  plan() {
    return Template.instance().data.item;
  },
  selectedPlan() {
    const profile = Users.getProfile(getRouteUserName());
    if (profile.academicPlanID) {
      return AcademicPlans.findDoc(profile.academicPlanID).name;
    }
    return '';
  },
});

Template.Landing_Explorer_Plans_Widget.events({
  'click .addItem': function selectAcademicPlan(event, instance) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const updateData = {};
    const collectionName = LandingProfiles.getCollectionName();
    updateData.id = profile._id;
    updateData.academicPlan = instance.data.id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        appLog.error(`Error updating ${getRouteUserName()}'s academic plan ${JSON.stringify(error)}`);
      } else {
        appLog.info(`Updated ${getRouteUserName()}'s academic plan to ${instance.data.slug}`);
      }
    });
  },
});

Template.Landing_Explorer_Plans_Widget.onRendered(function studentExplorerPlansWidgetOnRendered() {
  Template.instance().planVar.set(Template.instance().data.item);
});

Template.Landing_Explorer_Plans_Widget.onDestroyed(function studentExplorerPlansWidgetOnDestroyed() {
  // add your statement here
});

