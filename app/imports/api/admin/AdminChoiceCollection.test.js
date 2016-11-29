/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { AdminChoices } from './AdminChoiceCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '/imports/api/role/Role';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('AdminChoiceCollection', function testSuite() {
    const firstName = 'Philip';
    const lastName = 'Johnson';
    const slug = 'philipjohnson';
    const email = 'johnson@hawaii.edu';
    const role = ROLE.FACULTY;
    const password = 'foo';

    const advisor = {
      firstName: 'Gerald',
      lastName: 'Lau',
      slug: 'glau',
      email: 'glau@hawaii.edu',
      role: ROLE.ADVISOR,
      uhID: '8765-4315',
    };
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #getFacultyDoc, #removeIt', function test() {
      const userID = Users.define({ firstName, lastName, slug, email, role, password });
      const advisorID = Users.define(advisor);
      const choiceID = AdminChoices.define({ adminID: userID, facultyID: userID });
      expect(AdminChoices.isDefined(choiceID)).to.be.true;
      const faculty = AdminChoices.getFacultyDoc(choiceID);
      expect(Users.isDefined(faculty._id)).to.be.true;
      AdminChoices.updateAdvisorID(choiceID, advisorID);
      const advisorDoc = AdminChoices.getAdvisorDoc(choiceID);
      expect(Users.isDefined(advisorDoc._id)).to.be.true;
      AdminChoices.removeIt(choiceID);
      expect(AdminChoices.isDefined(choiceID)).to.be.false;
    });
  });
}

