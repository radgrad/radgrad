/**
 * Created by Cam Moore on 12/22/16.
 */
import { Template } from 'meteor/templating';
import { getStudents, NUM_TOP_MENU_ITEMS, counter } from './student-selector-functions';
import { sessionKeys } from '../../../startup/client/session-state';


Template.Student_Selector.helpers({
  getID(student) {
    return student._id;
  },
  justUseStudents() {
    const students = getStudents();
    return students.length <= NUM_TOP_MENU_ITEMS;
  },
  students() {
    return getStudents();
  },
  numbers() {
    return counter;
  },
  submenuArgs(number) {
    return {
      students: getStudents(),
      number,
    };
  },
});

Template.Student_Selector.events({
  'change #foo': function changeFoo(event, instance) {
    event.preventDefault();
    const student = event.target.value;
    instance.state.set(sessionKeys.CURRENT_STUDENT_ID, student);
  },
});

Template.Student_Selector.onCreated(function studentSelectorOnCreated() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
});

Template.Student_Selector.onRendered(function studentSelectorOnRendered() {
  const template = this;
  setTimeout(() => {
    template.$('.ui.dropdown').dropdown({ transition: 'drop' });
    template.$('div .item').popup({
      inline: true,
      hoverable: true,
      position: 'right center',
      lastResort: 'right center',
    });
  }, 300);
});

Template.Student_Selector.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});

