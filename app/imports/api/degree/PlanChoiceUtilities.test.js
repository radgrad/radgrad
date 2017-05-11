import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import * as planChoiceUtilities from './PlanChoiceUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PlanChoiceUtilities', function testSuite() {
    it('#satisfiesPlanChoice', function test() {
      let planChoice = 'ics111';
      let slug = 'ics111';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ee111';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      slug = 'ics141';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = 'ics313,ics331';
      slug = 'ics313';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      slug = 'ee331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = 'ics311,ee331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics311';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
      planChoice = '(ics313,ics331),ics355';
      slug = 'ics313';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics331';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      slug = 'ics355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.true;
      planChoice = '(ics313,ics331),(ics312,ics332)';
      slug = 'ics355';
      expect(planChoiceUtilities.satisfiesPlanChoice(planChoice, slug)).to.be.false;
    });
    it('#buildCourseSlugName', function test() {
      let slug = 'ics111';
      expect(planChoiceUtilities.buildCourseSlugName(slug)).to.equal('ICS 111');
      slug = 'ee111';
      expect(planChoiceUtilities.buildCourseSlugName(slug)).to.equal('EE 111');
    });
    it('#stripCounter', function test() {
      let slug = 'ics111';
      expect(planChoiceUtilities.stripCounter(slug)).to.equal('ics111');
      slug = 'ics400+-5';
      expect(planChoiceUtilities.stripCounter(slug)).to.equal('ics400+');
    });
    it('#is*Choice', function test() {
      let slug = 'ics111';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.true;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.false;
      slug = 'ics111,ics211';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.true;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.false;
      slug = 'ics111,(ics211,ics355)';
      expect(planChoiceUtilities.isSingleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isSimpleChoice(slug)).to.be.false;
      expect(planChoiceUtilities.isComplexChoice(slug)).to.be.true;
    });
    it('#complexChoiceToArray', function test() {
      let slug = 'ics111,(ics211,ics355)';
      let ans = planChoiceUtilities.complexChoiceToArray(slug);
      expect(ans.length).to.equal(3);
      expect(ans[1]).to.equal('ics211');
      slug = 'ics111';
      ans = planChoiceUtilities.complexChoiceToArray(slug);
      expect(ans.length).to.equal(1);
      expect(ans[0]).to.equal('ics111');
    });
  });
}
