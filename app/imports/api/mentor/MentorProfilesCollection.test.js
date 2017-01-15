import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorProfiles } from './MentorProfilesCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfilesCollection', function testSuite() {
    // Define course data.
    const mentorID = 'jgarces';
    const company = 'Capybara Inc';
    const career = 'Software Ninja';
    const location = 'Honolulu, HI';
    const linkedin = 'josephinegarces';
    const motivation = 'Because I can!';

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const instanceID = MentorProfiles.define({ mentorID, company, career, location, linkedin, motivation });
      expect(MentorProfiles.isDefined(instanceID)).to.be.true;
      MentorProfiles.removeIt(instanceID);
      expect(MentorProfiles.isDefined(instanceID)).to.be.false;
    });
  });
}
