import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Explorer_Accordion.onRendered(function studentExplorerAccordionWidgetOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.Student_Explorer_Accordion.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return user.picture;
  },
});

Template.Student_Explorer_Accordion.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const item = event.target.value;
    const studentItems = student.careerGoalIDs;
    try {
      studentItems.push(item);
      console.log(item);
      Users.setCareerGoalIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
});
