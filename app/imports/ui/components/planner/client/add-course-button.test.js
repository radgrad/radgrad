/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Template } from 'meteor/templating';
import { chai } from 'meteor/practicalmeteor:chai';
import { withRenderedTemplate } from '../../../test-helpers';
import { $ } from 'meteor/jquery';
import { Courses } from '/imports/api/course/CourseCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { clientRemoveAllEntities } from '/imports/api/base/BaseUtilities';
import '/client/lib/semantic-ui/semantic.min';
import '../academic-plan.html';
import '../academic-plan';
import '../add-course-button.html';
import '../add-course-button.js';

describe('Add_Course_Button', function test() {
  beforeEach(function () {
    Template.registerHelper('_', key => key);
    clientRemoveAllEntities();
  });

  afterEach(function () {
    Template.deregisterHelper('_');
    clientRemoveAllEntities();
  });

  it('renders correctly with type add', function () {
    const name = 'Algorithms';
    const slug = 'ics311';
    const number = 'ICS 311';
    const description = 'Study algorithms';
    const creditHrs = 3;
    const interests = [makeSampleInterest()];
    const docID = Courses.define({ name, slug, number, description, creditHrs, interests });
    const course = Courses.findDoc(docID);
    const data = {
      buttonType: 'add',
      course,
    };
    withRenderedTemplate('Add_Course_Button', data, (el) => {
      chai.assert.equal($(el).find('[draggable]').length, 1);
      chai.assert.equal($(el).find('[draggable]').text().trim(), 'ICS 311');
    });
  });
  it('renders correctly with type remove', function () {
    const data = {
      buttonType: 'remove',
    };
    withRenderedTemplate('Add_Course_Button', data, (el) => {
      chai.assert.equal($(el).find('div.removeFromPlan').length, 1);
      chai.assert.equal($(el).find('div.removeFromPlan').text().trim(), 'REMOVE FROM PLAN');
      chai.assert.equal($(el).find('[draggable]').length, 0);
    });
  });
  it('renders correctly with type taken', function () {
    const data = {
      buttonType: 'taken',
    };
    withRenderedTemplate('Add_Course_Button', data, (el) => {
      chai.assert.equal($(el).find('h5').length, 1);
      chai.assert.equal($(el).find('h5').text().trim(), 'COMPLETED');
      chai.assert.equal($(el).find('[draggable]').length, 0);
    });
  });
});
