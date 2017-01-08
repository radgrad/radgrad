/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

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

    it('#define, #isDefined, #removeIt', function test() {
      DesiredDegrees.define({ name, shortName, slug, description });
      expect(DesiredDegrees.isDefined(slug)).to.be.true;
      DesiredDegrees.removeIt(slug);
      expect(DesiredDegrees.isDefined(slug)).to.be.false;
    });
  });
}

