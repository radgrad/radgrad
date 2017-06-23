import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off', max-len: 'off' */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('DesiredDegreeCollection Meteor Methods', function test() {
    const collectionName = DesiredDegrees.getCollectionName();
    const definitionData = {
      name: 'B.A. in Information and Computer Sciences Test',
      shortName: 'B.A. ICS Test',
      slug: 'ba-ics-test',
      description: 'The Bachelor of Arts (BA) degree allows you to combine computer science with another discipline. You might find the BA degree of interest if you are also interested in biology, entrepreneurship, game design, graphic arts, financial engineering, foreign languages, or other disciplines.\n\nIn general, the BA requires you to complete the ICS core curriculum, plus three ICS 400-level courses, plus four upper division courses in a related area of concentration.\n\nFor more details, see the [ICS BA Degree Page](http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/ba-ics/).',
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user'], done);
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
          const id = DesiredDegrees.findIdBySlug(definitionData.slug);
          const name = 'updated DesiredDegree name';
          const shortName = 'updated short name';
          const description = 'updated description';
          updateMethod.call({ collectionName, updateData: { id, name, shortName, description } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
    });
  });
}
