/**
 * Created by Cam Moore on 12/22/16.
 */
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import * as menuUtils from './student-selector-functions';

function getSubmenuStudents(students, number) {
  const startIndex = number * menuUtils.SUBMENU_ITEM_COUNT;
  if (startIndex < students.length) {
    return students.splice(startIndex, menuUtils.SUBMENU_ITEM_COUNT);
  }
  return [];
}

Template.Student_Selector_Submenu.helpers({
  topMenuLabel() {
    const data = Template.instance().state;
    const range = getSubmenuStudents(data.students.slice(0), data.number);
    if (range.length > 0) {
      const name1 = range[0].lastName;
      let name2;
      if (range.length < menuUtils.SUBMENU_ITEM_COUNT) {
        name2 = range[range.length - 1].lastName;
      } else {
        name2 = range[menuUtils.SUBMENU_ITEM_COUNT - 1].lastName;
      }
      return `${name1} - ${name2}`;
    }
    return '';
  },
  haveMenu() {
    const state = Template.instance().state;
    return state.students.length >= state.number * menuUtils.SUBMENU_ITEM_COUNT;
  },
  students() {
    const state = Template.instance().state;
    return getSubmenuStudents(state.students, state.number);
  },
  studentName(student) {
    return `${student.lastName}, ${student.firstName}`;
  },
});

Template.Student_Selector_Submenu.events({
  // add your events here
});

Template.Student_Selector_Submenu.onCreated(function studentSelectorSubmenuOnCreated() {
  this.state = this.data;
});

Template.Student_Selector_Submenu.onRendered(function studentSelectorSubmenuOnRendered() {
  const template = this;
  Tracker.afterFlush(() => {
    template.$('.popup')
        .popup({
          inline: false,
          hoverable: true,
        });
  });
});

Template.Student_Selector_Submenu.onDestroyed(function studentSelectorSubmenuOnDestroyed() {
  // add your statement here
});

