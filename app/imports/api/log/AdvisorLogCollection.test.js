/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { makeSampleUser } from '/imports/api/user/SampleUsers';
import { AdvisorLogs } from './AdvisorLogCollection';
import { ROLE } from '/imports/api/role/Role';

if (Meteor.isServer) {
  describe('AdvisorLogCollection', function testSuite() {
    // Define course data.
    let student;
    let advisor;
    let text;

    before(function setup() {
      removeAllEntities();
      student = makeSampleUser();
      advisor = makeSampleUser(ROLE.ADVISOR);
      text = 'This is a sample log.';
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt #dumpOne, #restoreOne', function test() {
      let docID = AdvisorLogs.define({ advisor, student, text });
      expect(AdvisorLogs.isDefined(docID)).to.be.true;
      const dumpObject = AdvisorLogs.dumpOne(docID);
      AdvisorLogs.removeIt(docID);
      expect(AdvisorLogs.isDefined(docID)).to.be.false;
      docID = AdvisorLogs.restoreOne(dumpObject);
      expect(AdvisorLogs.isDefined(docID)).to.be.true;
      AdvisorLogs.removeIt(docID);
    });
  });
}
