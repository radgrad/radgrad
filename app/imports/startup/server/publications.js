import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { Users } from '../../api/user/UserCollection';

// Publish all RadGrad collections.
_.forEach(RadGrad.collections, collection => collection.publish());

// User collection is not part of RadGrad collections, so publish it separately.
Users.publish();

// Publish the roles field for Meteor Accounts.
export const meteorAccountDataPublicationName = 'MeteorAccountData';
Meteor.publish(meteorAccountDataPublicationName, function () {
  return Meteor.users.find({}, { fields: { roles: 1 } });
});
