// import { Meteor } from 'meteor/meteor';
// import { Template } from 'meteor/templating';
// import { expect } from 'chai';
// import { $ } from 'meteor/jquery';
// import '../../../../client/lib/semantic-ui/semantic.min';
// import { withRenderedTemplate } from '../../utilities/test-helpers';
// import { Courses } from '../../../api/course/CourseCollection';
// import { coursesDefineMethod } from '../../../api/course/CourseCollection.methods';
// import { makeSampleInterest } from '../../../api/interest/SampleInterests';
// import './academic-plan.html';
// import './academic-plan';
// import './add-course-button.html';
// import './add-course-button.js';
//
// /* eslint-env mocha */
// /* eslint-disable func-names, prefer-arrow-callback */
// if (Meteor.isClient) {
//   describe('Add_Course_Button', function test() {
//     beforeEach(function () {
//       Template.registerHelper('_', key => key);
//     });
//
//     afterEach(function () {
//       Template.deregisterHelper('_');
//     });
//
//     it('renders correctly with type add', function () {
//       const name = 'Algorithms';
//       const slug = 'ics_311';
//       const number = 'ICS 311';
//       const description = 'Study algorithms';
//       const creditHrs = 3;
//       const interests = [makeSampleInterest()];
//       coursesDefineMethod.call({ name, slug, number, description, creditHrs, interests }, (error, result) => {
//         if (error) {
//           console.log('Error defining Course', error);
//         } else {
//           const course = Courses.findDoc(result);
//           const data = {
//             buttonType: 'add',
//             course,
//           };
//           withRenderedTemplate('Add_Course_Button', data, (el) => {
//             expect($(el).find('[draggable]').length).to.equal(1);
//             expect($(el).find('[draggable]').text().trim()).to.equal('ICS 311');
//           });
//         }
//       });
//     });
//     it('renders correctly with type remove', function () {
//       const data = {
//         buttonType: 'remove',
//       };
//       withRenderedTemplate('Add_Course_Button', data, (el) => {
//         expect($(el).find('div.removeFromPlan').length).to.equal(1);
//         expect($(el).find('div.removeFromPlan').text().trim()).to.equal('REMOVE FROM PLAN');
//         expect($(el).find('[draggable]').length).to.equal(0);
//       });
//     });
//     it('renders correctly with type taken', function () {
//       const data = {
//         buttonType: 'taken',
//       };
//       withRenderedTemplate('Add_Course_Button', data, (el) => {
//         expect($(el).find('h5').length).to.equal(1);
//         expect($(el).find('h5').text().trim()).to.equal('COMPLETED');
//         expect($(el).find('[draggable]').length).to.equal(0);
//       });
//     });
//   });
// }
