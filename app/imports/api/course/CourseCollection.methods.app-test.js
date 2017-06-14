import { Meteor } from 'meteor/meteor';
import { resetDatabaseMethod, defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { Courses } from './CourseCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseCollection Meteor Methods', function test() {
    const collectionName = 'CourseCollection';
    const definitionData = {
      name: 'Introduction to the theory and practice of scripting',
      shortName: 'Intro to Scripting',
      slug: 'ics_215',
      number: 'ICS 215',
      description: 'Introduction to scripting languages.',
      creditHrs: 4,
      interests: ['java'],
      syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
      prerequisites: ['ics_111'],
    };

    before(function (done) {
      this.timeout(0);
      defineTestFixturesMethod.call(['minimal', 'admin.user'], done);
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
          const id = Courses.findIdBySlug(definitionData.slug);
          const name = 'updated CareerGoal name';
          const description = 'updated CareerGoal description';
          const interests = ['algorithms', 'java'];
          const prerequisites = ['ics_111', 'ics_141'];
          updateMethod.call({ collectionName, updateData: { id, name, description, interests, prerequisites } }, done);
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
