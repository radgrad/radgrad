import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod } from '../base/BaseCollection.methods';
import { Semesters } from '../semester/SemesterCollection';
import { processVerificationEventMethod } from './VerificationRequestCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('VerificationRequestCollection Meteor Methods TestBatch3', function test() {
    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user', 'opportunities'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('ProcessVerificationEvent Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const student = 'abi';
          const opportunity = 'acm-icpc';
          const semester = Semesters.getSemester(new Date('2016-11-18T00:00:00.000Z'));
          processVerificationEventMethod.call({ student, opportunity, semester }, function () {
            done();
          });
        }).catch(done);
      });
    });
  });
}
