/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { ROLE, isRole, assertRole } from '/imports/api/role/Role';
import { Roles } from 'meteor/alanning:roles';

if (Meteor.isServer) {
  describe('Role', function testSuite() {
    it('Test role definitions, isRole', function test() {
      expect(Roles.getAllRoles().fetch()).to.have.lengthOf(4);
      expect(isRole(ROLE.FACULTY)).to.be.true;
      expect(isRole('Grad Student')).to.be.false;
    });

    it('assertRole', function test() {
      expect(function foo() { assertRole(ROLE.STUDENT);}).to.not.throw(Error);
      expect(function foo() { assertRole('foo');}).to.throw(Error);
    });
  });
}
