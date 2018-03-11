import { Meteor } from 'meteor/meteor';
import { userInteractionDefineMethod, userInteractionRemoveUserMethod } from './UserInteractionCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('UserInteraction Meteor Methods ', function test() {
    const student = 'abi@hawaii.edu';

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      const definitionData = {
        userID: Users.getID(student),
        type: 'interaction-type',
        typeData: 'interaction-data',
      };
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await userInteractionDefineMethod.callPromise(definitionData);
    });

    it('Remove Method', async function () {
      await userInteractionRemoveUserMethod.callPromise(student);
    });
  });
}
