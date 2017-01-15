import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { MentorProfiles } from './MentorProfilesCollection';

if (Meteor.isServer) {
  describe('MentorProfilesCollection', function testSuite() {
    // Define course data.
    let mentorID = 'jgarces';
    let company = 'Capybara Inc' ;
    let career = 'Software Ninja' ;
    let location = 'Honolulu, HI';
    let linkedin = 'josephinegarces';
    let motivation = 'Because I can!';

    before(function setup() {
      removeAllEntities();

    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      let instanceID = MentorProfiles.define({ mentorID, company, career, location, linkedin, motivation });
      expect(MentorProfiles.isDefined(instanceID)).to.be.true;
      MentorProfiles.removeIt(instanceID);
      expect(MentorProfiles.isDefined(instanceID)).to.be.false;
    });
  });
}
