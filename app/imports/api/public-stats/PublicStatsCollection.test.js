/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
// import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { PublicStats } from './PublicStatsCollection';

if (Meteor.isServer) {
  describe('PublicStatsCollecion', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#careerGoalsTotal, #careerGoalsList', function test() {
      PublicStats.careerGoalsTotal();
    });
  });
}
