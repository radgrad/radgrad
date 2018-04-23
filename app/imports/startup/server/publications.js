import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { ROLE } from '../../api/role/Role';
import { Users } from '../../api/user/UserCollection';

// Publish all RadGrad collections.
_.forEach(RadGrad.collections, collection => collection.publish());

// User collection is not part of RadGrad collections, so publish it separately.
Users.publish();

// User Status
Meteor.publish('userStatus', function () {
  if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
    return Meteor.users.find({ 'status.online': true });
  }
  return [];
});
