import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { MentorProfiles } from './MentorProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MentorProfileCollection Meteor Methods', function test() {
    const collectionName = MentorProfiles.getCollectionName();
    const definitionData = {
      mentor: 'brewer',
      company: 'Capybara Inc',
      career: 'Software Ninja',
      location: 'Honolulu, HI',
      linkedin: 'josephinegarces',
      motivation: 'Because I can!',
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user', 'brewer.user'], done);
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
          const id = MentorProfiles.findDoc({ location: definitionData.location })._id;
          const company = 'Tableau';
          const career = 'Software Engineer';
          const location = 'Palo Alto, CA';
          const linkedin = 'robertsbrewer';
          const motivation = 'I founded a startup in Hawaii';
          updateMethod.call({ collectionName,
            updateData: { id, company, career, location, linkedin, motivation } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const instance = MentorProfiles.findDoc({ location: 'Palo Alto, CA' })._id;
          removeItMethod.call({ collectionName, instance }, done);
        }).catch(done);
      });
    });
  });
}
