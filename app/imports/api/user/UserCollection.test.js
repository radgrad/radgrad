/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Users } from '../user/UserCollection';
import { InterestTypes } from '../interest/InterestTypeCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { ROLE } from '../role/Role';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleCourseInstance } from '../course/SampleCourses';

if (Meteor.isServer) {
  describe('UserCollection', function testSuite() {
    const firstName = 'Philip';
    const lastName = 'Johnson';
    const slug = 'philipjohnson';
    const email = 'johnson@hawaii.edu';
    const role = ROLE.FACULTY;
    const password = 'foo';

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.isDefined(docID)).to.be.true;
      const dumpObject = Users.dumpOne(docID);
      Users.removeIt(docID);
      expect(Users.isDefined(docID)).to.be.false;
      docID = Users.restoreOne(dumpObject);
      expect(Users.isDefined(docID)).to.be.true;
      Users.removeIt(docID);
    });

    it('#removeAllWithRole', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.isDefined(docID)).to.be.true;
      Users.removeAllWithRole(role);
      expect(Users.isDefined(docID)).to.be.false;
    });

    it('#assertInRole', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(function foo() { Users.assertInRole(docID, role); }).to.not.throw(Error);
      expect(function foo() { Users.assertInRole(docID, ROLE.STUDENT); }).to.throw(Error);
      Users.removeIt(docID);
    });

    it('#getEmail', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.getEmail(docID)).to.equal(email);
      Users.removeIt(docID);
    });

    it('#setDesiredDegree, #setInterestIds, #setPicture, #setUhId', function test() {
      const desiredDegreeSlug = 'bs-cs';
      const degreeID = DesiredDegrees.define({ name: 'BS CS', slug: desiredDegreeSlug, description: 'bs in cs' });
      InterestTypes.define({ name: 'Discipline', slug: 'discipline', description: 'foo' });
      const interestId = Interests.define({ name: 'AI', slug: 'AI', description: 'AI', interestType: 'discipline' });
      const picture = 'http://foo.com/picture.jpg';
      const uhID = '123456789';
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      Users.setDesiredDegree(docID, desiredDegreeSlug);
      expect(Users.findDoc(docID).desiredDegreeID).to.equal(degreeID);
      Users.setInterestIds(docID, [interestId]);
      expect(Users.findDoc(docID).interestIDs[0]).to.equal(interestId);
      Users.setPicture(docID, picture);
      expect(Users.findDoc(docID).picture).to.equal(picture);
      Users.setUhId(docID, uhID);
      expect(Users.findDoc(docID).uhID).to.equal(uhID);
      expect(Users.getUserFromUhId(uhID)._id).to.equal(docID);
      expect(Users.getUserFromUsername(slug)._id).to.equal(docID);
      Users.removeIt(docID);
      Interests.removeIt(interestId);
      InterestTypes.removeIt('discipline');
    });

    it('#getCourseIDs', function test() {
      const userID = Users.define({ firstName, lastName, slug, email, role, password });
      const courseInstanceID = makeSampleCourseInstance(Users.findSlugByID(userID));
      expect(Users.getCourseIDs(userID)).to.have.lengthOf(1);
      expect(function foo() { Users.removeIt(userID); }).to.throw(Error);
      CourseInstances.removeIt(courseInstanceID);
    });
  });
}

