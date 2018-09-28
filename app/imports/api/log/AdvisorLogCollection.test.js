import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleUser } from '../user/SampleUsers';
import { AdvisorLogs } from './AdvisorLogCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

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

    it('#define, #isDefined, #removeIt #dumpOne, #restoreOne, #checkIntegrity', function test() {
      let docID = AdvisorLogs.define({ advisor, student, text });
      expect(AdvisorLogs.isDefined(docID)).to.be.true;
      const dumpObject = AdvisorLogs.dumpOne(docID);
      AdvisorLogs.removeIt(docID);
      expect(AdvisorLogs.isDefined(docID)).to.be.false;
      docID = AdvisorLogs.restoreOne(dumpObject);
      expect(AdvisorLogs.isDefined(docID)).to.be.true;
      const error = AdvisorLogs.checkIntegrity();
      expect(error.length).to.equal(0);
      AdvisorLogs.removeIt(docID);
    });
    it('#getAdvisorDoc, #getStudentDoc, #checkIntegrity', function test() {
      const docID = AdvisorLogs.define({ advisor, student, text });
      const advisorDoc = AdvisorLogs.getAdvisorDoc(docID);
      const a = Users.getProfile(advisor);
      expect(advisorDoc.username).to.equal(a.username);
      const studentDoc = AdvisorLogs.getStudentDoc(docID);
      const s = Users.getProfile(student);
      expect(studentDoc.username).to.equal(s.username);
      AdvisorLogs.removeIt(docID);
    });
    // In Meteor 1.6.1, this fails with UnhandledPromiseRejectionWarning
    // it('#publish', function test(done) {
    //   AdvisorLogs.define({ advisor, student, text });
    //   AdvisorLogs.publish();
    //   const collector = new PublicationCollector({ userID: student });
    //   collector.collect(AdvisorLogs.getPublicationName(), (collections) => {
    //     expect(collections).to.be.an('object');
    //     expect(collections[AdvisorLogs.getPublicationName()]).to.be.an('array');
    //     expect(collections[AdvisorLogs.getPublicationName()].length).to.equal(0);
    //   });
    //   done();
    // });
  });
}
