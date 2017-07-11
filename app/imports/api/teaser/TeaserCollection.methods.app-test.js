import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Teasers } from './TeaserCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('TeaserCollection Meteor Methods ', function test() {
    const collectionName = Teasers.getCollectionName();
    const definitionData = {
      title: 'name',
      slug: 'opportunity-slug-example',
      author: 'Amy',
      opportunity: 'acm-manoa',
      url: 'http://cnn.com',
      interests: ['algorithms'],
      description: 'description',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'opportunities'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Teasers.findIdBySlug(definitionData.slug);
      const description = 'updated description';
      await updateMethod.callPromise({ collectionName, updateData: { id, description } });
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
    });
  });
}
