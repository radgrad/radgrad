/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Users } from '/imports/api/user/UserCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { ROLE } from '/imports/api/role/Role';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';
import { makeSampleCourseInstance } from '/imports/api/course/SampleCourses';

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

    it('#define, #isDefined, #removeIt', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.isDefined(docID)).to.be.true;
      Users.removeIt(docID);
      expect(Users.isDefined(docID)).to.be.false;
    });

    it('#removeAllWithRole', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.isDefined(docID)).to.be.true;
      Users.removeAllWithRole(role);
      expect(Users.isDefined(docID)).to.be.false;
    });

    it('#assertInRole', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(function foo() { Users.assertInRole(docID, role);}).to.not.throw(Error);
      expect(function foo() { Users.assertInRole(docID, ROLE.STUDENT);}).to.throw(Error);
      Users.removeIt(docID);
    });

    it('#getEmail', function test() {
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      expect(Users.getEmail(docID)).to.equal(email);
      Users.removeIt(docID);
    });

    it('#setAboutMe, #setDesiredDegree, #setInterestIds, #setPicture, #setSemesterId, #setUhId', function test() {
      const aboutMe = 'About me string.';
      const desiredDegree = 'B.S. Computer Science';
      InterestTypes.define({ name: 'Discipline', slug: 'discipline', description: 'foo' });
      const interestId = Interests.define({ name: 'AI', slug: 'AI', description: 'AI', interestType: 'discipline' });
      const picture = 'http://foo.com/picture.jpg';
      const semesterID = Semesters.define({ term: Semesters.FALL, year: 2015 });
      const uhID = '123456789';
      const docID = Users.define({ firstName, lastName, slug, email, role, password });
      Users.setAboutMe(docID, aboutMe);
      expect(Users.findDoc(docID).aboutMe).to.equal(aboutMe);
      Users.setDesiredDegree(docID, desiredDegree);
      expect(Users.findDoc(docID).desiredDegree).to.equal(desiredDegree);
      Users.setInterestIds(docID, [interestId]);
      expect(Users.findDoc(docID).interestIDs[0]).to.equal(interestId);
      Users.setPicture(docID, picture);
      expect(Users.findDoc(docID).picture).to.equal(picture);
      Users.setSemesterId(docID, semesterID);
      expect(Users.findDoc(docID).semesterID).to.equal(semesterID);
      Users.setUhId(docID, uhID);
      expect(Users.findDoc(docID).uhID).to.equal(uhID);
      Users.removeIt(docID);
      Interests.removeIt(interestId);
      InterestTypes.removeIt('discipline');
    });

    it('#getCourseIDs', function test() {
      const userID = Users.define({ firstName, lastName, slug, email, role, password });
      makeSampleCourseInstance(Users.findSlugByID(userID));
      expect(Users.getCourseIDs(userID)).to.have.lengthOf(1);
      Users.removeIt(userID);
    });
  });
}

