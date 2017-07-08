import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CareerGoals } from './CareerGoalCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CareerGoalCollection Meteor Methods TestBatch1', function test() {
    const collectionName = CareerGoals.getCollectionName();
    const definitionData = {
      name: 'name',
      slug: 'career-goal-slug-example',
      description: 'description',
      interests: ['algorithms'],
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student',
        'extended.courses.interests', 'academicplan', 'abi.courseinstances'], done);
      done();
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
      done();
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
      done();
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = CareerGoals.findIdBySlug(definitionData.slug);
          const name = 'updated CareerGoal name';
          const description = 'updated CareerGoal description';
          const interests = ['algorithms', 'java'];
          updateMethod.call({ collectionName, updateData: { id, name, description, interests } }, done);
        }).catch(done);
      });
      done();
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
      done();
    });
  });
}
