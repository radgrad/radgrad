import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorProfiles } from './MentorProfileCollection';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { ROLE } from '/imports/api/role/Role';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfileCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const mentor = makeSampleUser(ROLE.MENTOR);
      const company = 'Capybara Inc';
      const career = 'Software Ninja';
      const location = 'Honolulu, HI';
      const linkedin = 'josephinegarces';
      const motivation = 'Because I can!';
      const instanceID = MentorProfiles.define({ mentor, company, career, location, linkedin, motivation });
      expect(MentorProfiles.isDefined(instanceID)).to.be.true;
      MentorProfiles.removeIt(instanceID);
      expect(MentorProfiles.isDefined(instanceID)).to.be.false;
    });
  });
}
