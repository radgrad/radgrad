import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Explorer_Degrees_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  degreeName(degreeSlugName) {
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.find({ slugID: slug[0]._id }).fetch();
    return degree[0].name;
  },
  userStatus(degree) {
    let ret = true;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.desiredDegreeID, degree._id)) {
      ret = false;
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
