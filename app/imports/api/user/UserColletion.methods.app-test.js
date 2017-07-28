import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { StudentProfiles } from './StudentProfileCollection';
import { defineMethod } from '../base/BaseCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { updateAcademicPlanMethod } from './UserCollection.methods';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('StudentProfileCollection Meteor Methods ', function test() {
    const collectionName = StudentProfiles.getCollectionName();
    const username = 'amytaka';
    const firstName = 'Amy';
    const lastName = 'Takayesu';
    const picture = 'amytaka.jpg';
    const website = 'http://amytaka.github.io';
    const interests = [];
    const careerGoals = [];
    const level = 6;

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });
    it('updateAcademicPlanMethod', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals, level };
      const profileID = await defineMethod.callPromise({ collectionName, definitionData });
      let amyProfile = StudentProfiles.findDoc(profileID);
      expect(amyProfile.academicPlanID).to.be.undefined;
      await updateAcademicPlanMethod.callPromise('bs-cs-2016');
      amyProfile = StudentProfiles.findDoc(profileID);
      expect(amyProfile.academicPlanID).to.not.be.undefined;
    });

  });
}
