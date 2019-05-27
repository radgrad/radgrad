import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DesiredDegreeCollection', function testSuite() {
    const name = 'Bachelors in Computer Science';
    const shortName = 'B.S. CS';
    const slug = 'bs-cs';
    const description = 'B.S. in CS.';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = DesiredDegrees.define({ name, shortName, slug, description });
      expect(DesiredDegrees.isDefined(slug)).to.be.true;
      let dumpObject = DesiredDegrees.dumpOne(docID);
      expect(dumpObject.retired).to.be.undefined;
      expect(DesiredDegrees.findNonRetired().length).to.equal(1);
      DesiredDegrees.update(docID, { retired: true });
      expect(DesiredDegrees.findNonRetired().length).to.equal(0);
      DesiredDegrees.removeIt(slug);
      expect(DesiredDegrees.isDefined(slug)).to.be.false;
      docID = DesiredDegrees.restoreOne(dumpObject);
      expect(DesiredDegrees.isDefined(slug)).to.be.true;
      DesiredDegrees.update(docID, { retired: true });
      dumpObject = DesiredDegrees.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      DesiredDegrees.removeIt(slug);
    });
  });
}

