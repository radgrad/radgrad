import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Reviews } from './ReviewCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('ReviewCollection Meteor Methods ', function test() {
    const collectionName = Reviews.getCollectionName();
    // Note that we allow the slug to be defined by default.
    const definitionData = {
      student: 'abi@hawaii.edu',
      reviewType: 'course',
      reviewee: 'ics_111',
      semester: 'Fall-2016',
      rating: 3,
      comments: 'This is great!',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Reviews.findIdBySlug('review-course-ics_111-abi@hawaii.edu');
      const rating = 5;
      const comments = 'new comments';
      await updateMethod.callPromise({ collectionName, updateData: { id, rating, comments } });
    });

    it('Remove Method', async function () {
      const id = Reviews.findIdBySlug('review-course-ics_111-abi@hawaii.edu');
      await removeItMethod.callPromise({ collectionName, instance: id });
    });
  });
}
