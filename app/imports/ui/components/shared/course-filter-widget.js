import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { courseFilterKeys } from './card-explorer-courses-widget';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { ROLE } from '../../../api/role/Role';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

Template.Course_Filter_Widget.onCreated(function coursefilterwidgetOnCreated() {
  this.filter = this.data.filter;
});

Template.Course_Filter_Widget.helpers({
  isAll() {
    return Template.instance().filter.get() === courseFilterKeys.none;
  },
  all() {
    return courseFilterKeys.none;
  },
  is300() {
    return Template.instance().filter.get() === courseFilterKeys.threeHundredPLus;
  },
  threeHundredPlus() {
    return courseFilterKeys.threeHundredPLus;
  },
  is400() {
    return Template.instance().filter.get() === courseFilterKeys.fourHundredPlus;
  },
  fourHundredPlus() {
    return courseFilterKeys.fourHundredPlus;
  },
  is600() {
    return Template.instance().filter.get() === courseFilterKeys.sixHundredPlus;
  },
  sixHundredPlus() {
    return courseFilterKeys.sixHundredPlus;
  },
});

Template.Course_Filter_Widget.events({
  change: function change(event) {
    Template.instance().filter.set(event.target.value);
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
    updateData.courseExplorerFilter = event.target.value;
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Failed to update course explorer filter', error);
      }
    });
  },
});

Template.Course_Filter_Widget.onRendered(function coursefilterwidgetOnRendered() {
  this.$('.ui.radio.checkbox').checkbox();
});

Template.Course_Filter_Widget.onDestroyed(function coursefilterwidgetOnDestroyed() {
  // add your statement here
});
