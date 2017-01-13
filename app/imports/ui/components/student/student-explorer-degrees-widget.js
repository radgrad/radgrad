import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Degrees_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return Users.findDoc(user).picture;
  },
  degreeName(degreeSlugName) {
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.find({ slugID: slug[0]._id }).fetch();
    return degree[0].name;
  },
  userStatus(degree) {
    let ret = false;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.desiredDegreeID, degree._id)) {
      ret = true;
    }
    return ret;
  },
});

Template.Student_Explorer_Degrees_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    try {
      Users.setDesiredDegree(student._id, id);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    try {
      Users.setDesiredDegree(student._id, '');
    } catch (e) {
      // don't do anything.
    }
  },
});

Template.Student_Explorer_Degrees_Widget.onCreated(function studentExplorerDegreesWidgetOnCreated() {
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});
