import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sortOrderKeys } from './card-explorer-opportunities-widget';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { ROLE } from '../../../api/role/Role';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

Template.Opportunity_Sort_Order_Widget.onCreated(function opportunitysortorderwidgetOnCreated() {
  this.sortOrder = this.data.sortOrder;
});

Template.Opportunity_Sort_Order_Widget.helpers({
  isMatch() {
    return Template.instance().sortOrder.get() === sortOrderKeys.match;
  },
  isInnovation() {
    return Template.instance().sortOrder.get() === sortOrderKeys.i;
  },
  isExperience() {
    return Template.instance().sortOrder.get() === sortOrderKeys.e;
  },
  isAlpha() {
    return Template.instance().sortOrder.get() === sortOrderKeys.alpha;
  },
  match() {
    return sortOrderKeys.match;
  },
  i() {
    return sortOrderKeys.i;
  },
  e() {
    return sortOrderKeys.e;
  },
  alpha() {
    return sortOrderKeys.alpha;
  },
});

Template.Opportunity_Sort_Order_Widget.events({
  change: function change(event) {
    Template.instance().sortOrder.set(event.target.value);
    const profile = Users.getProfile(getUserIdFromRoute());
    // console.log(profile);
    let collectionName = '';
    switch (profile.role) {
      case ROLE.FACULTY:
        collectionName = FacultyProfiles.getCollectionName();
        break;
      case ROLE.STUDENT:
        collectionName = StudentProfiles.getCollectionName();
        break;
      case ROLE.MENTOR:
        collectionName = MentorProfiles.getCollectionName();
        break;
      default:
        throw new Meteor.Error(`Bad role ${profile.role}`);
    }
    const updateData = {};
    updateData.id = profile._id;
    updateData.opportunityExplorerSortOrder = event.target.value;
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Failed to update course explorer filter', error);
      }
    });
  },
});

Template.Opportunity_Sort_Order_Widget.onRendered(function opportunitysortorderwidgetOnRendered() {
  this.$('.ui.radio.checkbox').checkbox();
});

Template.Opportunity_Sort_Order_Widget.onDestroyed(function opportunitysortorderwidgetOnDestroyed() {
  // add your statement here
});

