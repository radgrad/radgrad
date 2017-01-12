import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { getRouteUserName } from '../shared/route-user-name';


Template.Student_Explorer_CareerGoals_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return Users.findDoc(user).picture;
  },
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  userStatus(careerGoal) {
    let ret = false;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      ret = true;
    }
    return ret;
  },
});

Template.Student_Explorer_CareerGoals_Widget.events({
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

Template.Student_Explorer_CareerGoals_Widget.onCreated(function studentExplorerCareerGoalsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});
