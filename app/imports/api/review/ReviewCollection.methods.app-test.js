import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Reviews } from './ReviewCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('ReviewCollection Meteor Methods', function test() {
    const collectionName = Reviews.getCollectionName();
    // Note that we allow the slug to be defined by default.
    const definitionData = {
      student: 'abi',
      reviewType: 'course',
      reviewee: 'ics_111',
      semester: 'Fall-2016',
      rating: 3,
      comments: 'This is great!',
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'abi.user'], done);
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
          const id = Reviews.findIdBySlug('review-course-ics_111-abi');
          const rating = 5;
          const comments = 'new comments';
          updateMethod.call({ collectionName, updateData: { id, rating, comments } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = Reviews.findIdBySlug('review-course-ics_111-abi');
          removeItMethod.call({ collectionName, instance: id }, done);
        }).catch(done);
      });
    });
  });
}
