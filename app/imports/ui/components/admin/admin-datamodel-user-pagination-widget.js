import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';

Template.Admin_Datamodel_User_Pagination_Widget.onCreated(function adminDatamodelUserPaginationWidgetOnCreated() {
  // console.log('onCreated data=%o', this.data);
  if (this.data) {
    this.showItemCount = this.data.showItemCount;
    this.showIndex = this.data.showIndex;
    this.role = this.data.role;
  }
});

Template.Admin_Datamodel_User_Pagination_Widget.helpers({
  paginationLabel() {
    const count = Users.findProfilesWithRole(Template.instance().role, {}, { sort: { lastName: 1 } }).length;
    if (count < Template.instance().showItemCount.get()) {
      return 'Showing all';
    }
    const startIndex = Template.instance().showIndex.get() + 1;
    let endIndex = startIndex + Template.instance().showItemCount.get();
    endIndex--;
    if (endIndex > count) {
      endIndex = count;
    }
    return ` ${startIndex} - ${endIndex} of ${count} `;
  },
  firstDisabled() {
    return Template.instance().showIndex.get() === 0;
  },
  lastDisabled() {
    if (Template.instance().collection) {
      const count = Template.instance()
        .collection
        .count();
      const index = Template.instance()
        .showIndex
        .get();
      const showCount = Template.instance()
        .showItemCount
        .get();
      return (index + showCount) >= count;
    }
    return false;
  },
  isSelected(count) {
    return count === Template.instance().showItemCount.get();
  },
});

Template.Admin_Datamodel_User_Pagination_Widget.events({
  'click .jsFirst': function jsFirst(event, instance) {
    event.preventDefault();
    instance.showIndex.set(0);
  },
  'click .jsPrev': function jsFirst(event, instance) {
    event.preventDefault();
    let index = instance.showIndex.get();
    index -= instance.showItemCount.get();
    if (index < 0) {
      index = 0;
    }
    instance.showIndex.set(index);
  },
  'click .jsNext': function jsFirst(event, instance) {
    event.preventDefault();
    const index = instance.showIndex.get();
    instance.showIndex.set(index + instance.showItemCount.get());
  },
  'click .jsLast': function jsFirst(event, instance) {
    event.preventDefault();
    const count = AcademicYearInstances.count();
    instance.showIndex.set(count - instance.showItemCount.get());
  },
  'change .jsNum': function jsNum(event, instance) {
    event.preventDefault();
    // console.log('event = %o instance = %o', event, instance);
    const numStr = event.target.value;
    instance.showItemCount.set(parseInt(numStr, 10));
  },
});
