/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Courses } from '/imports/api/course/CourseCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('CourseCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt', function test() {
      const name = 'Algorithms';
      const slug = 'ics311';
      const number = 'ICS 311';
      const description = 'Study algorithms';
      const creditHrs = 3;
      const interests = [makeSampleInterest()];
      Courses.define({ name, slug, number, description, creditHrs, interests });
      expect(Courses.isDefined(slug)).to.be.true;
      Courses.removeIt(slug);
      expect(Courses.isDefined(slug)).to.be.false;
    });
  });
}

