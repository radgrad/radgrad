import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('OpportunityInstanceCollection Meteor Methods', function test() {
    const collectionName = 'OpportunityInstanceCollection';
    const semester = 'Spring-2017';
    const student = 'abi';
    const opportunity = 'acm-manoa';
    const verified = true;
    const definitionData = {
      semester,
      opportunity,
      student,
      verified,
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user', 'opportunities'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = OpportunityInstances.findOpportunityInstanceDoc(semester, opportunity, student)._id;
          updateMethod.call({ collectionName, updateData: { id, verified: false } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = OpportunityInstances.findOpportunityInstanceDoc(semester, opportunity, student)._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
