import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AcademicPlans } from './AcademicPlanCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: 'off', no-unused-expressions: 'off' */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AcademicPlanCollection Meteor Methods TestBatch1', function test() {
    const collectionName = AcademicPlans.getCollectionName();
    const definitionData = {
      slug: 'bs-cs-2016',
      degreeSlug: 'bs-cs',
      name: 'B.S. in Computer Sciences',
      semester: 'Fall-2016',
      coursesPerSemester: [
        2,
        2,
        0,
        2,
        2,
        0,
        2,
        2,
        0,
        2,
        2,
        0,
      ],
      courseList: [
        'ics_111-1',
        'ics_141-1',
        'ics_211-1',
        'ics_241-1',
        'ics_311-1',
        'ics_314-1',
        'ics_212-1',
        'ics_321-1',
        'ics_312,ics_331-1',
        'ics_313,ics_361-1',
        'ics_332-1',
        'ics_400+-1',
        'ics_400+-2',
        'ics_400+-3',
        'ics_400+-4',
        'ics_400+-5',
      ],
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal'], done);
    });

    after(function (done) {
      resetDatabaseMethod.call(null, done);
    });

    it('Define Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          defineMethod.call({ collectionName, definitionData }, done);
        }).catch(done);
      });
    });

    it('Update Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          const id = AcademicPlans.findIdBySlug(definitionData.slug);
          const degreeSlug = 'ba-ics';
          const name = 'updated AcademicPlan name';
          const semester = 'Spring-2017';
          const cousesPerSemester = [3, 5];
          const courseList = ['ics_311-1', 'ics_314-1'];
          updateMethod.call({ collectionName, updateData: { id, degreeSlug, name, semester, cousesPerSemester,
            courseList } }, done);
        }).catch(done);
      });
    });

    it('Remove Method', function (done) {
      withLoggedInUser().then(() => {
        withRadGradSubscriptions().then(() => {
          removeItMethod.call({ collectionName, instance: definitionData.slug }, done);
        }).catch(done);
      });
    });
  });
}
