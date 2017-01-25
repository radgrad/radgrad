/* global FileReader */
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import * as planUtils from '../../../api/degree-program/plan-generator';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import * as courseUtils from '../../../api/course/CourseFunctions';
import * as opportunityUtils from '../../../api/opportunity/OpportunityFunctions';
import { _ } from 'meteor/erasaur:meteor-lodash';

const updateSchema = new SimpleSchema({
  firstName: { type: String, optional: false },
  lastName: { type: String, optional: false },
  slug: { type: String, optional: false }, // will rename this to username
  role: { type: String, optional: false },
  email: { type: String, optional: false },
  uhID: { type: String, optional: false },
  // remaining are optional.
  desiredDegree: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: [String], optional: true },
  interests: { type: [String], optional: true },
  website: { type: String, optional: true },
});

Template.Update_Degree_Plan_Widget.helpers({
  user() {
    if (Template.currentData().studentID.get()) {
      return Users.findDoc(Template.currentData().studentID.get());
    }
    return '';
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  desiredDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } });
  },
  roles() {
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN]));
  },
  slug() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return Slugs.findDoc(user.slugID).name;
    }
    return '';
  },
  semesters() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    return _.filter(Semesters.find({ sortBy: { $gte: currentSemester.sortBy } }, { sort: { sortBy: 1 } }).fetch(),
        function notSummer(s) {
          return s.term !== Semesters.SUMMER;
        });
  },
  selectedInterestIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.interestIDs;
    }
    return '';
  },
  selectedCareerGoalIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.careerGoalIDs;
    }
    return '';
  },
  selectedDesiredDegreeID() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.desiredDegreeID;
    }
    return '';
  },
  selectedRole() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      console.log('selectedRole', user.roles[0]);
      return user.roles[0];
    }
    return '';
  },
});

Template.Update_Degree_Plan_Widget.events({
  'click .jsGeneratePlan': function clickGeneratePlan(event, instance) {
    event.preventDefault();
    instance.$('.ui.modal').modal({
      onDeny: function () {
        console.log(instance);
      },
      onApprove: function () {
        const studentID = instance.data.studentID.get();
        const student = Users.findDoc(studentID);
        const currentSemester = Semesters.getCurrentSemesterDoc();
        const selectedSemesterID = instance.$('#planningSemester').val();
        console.log('selectedSemesterID', selectedSemesterID);
        // let startSemester;
        // if () {
        //   startSemester = Semesters.findDoc()
        // }
        // if (!startSemester) {
        //   startSemester = currentSemester;
        // }
        // if (currentSemester.sortBy === startSemester.sortBy) {
        //   startSemester = semUtils.nextFallSpringSemester(startSemester);
        // }
        // // TODO: CAM do we really want to blow away the student's plan. What if they've made changes?
        // courseUtils.clearPlannedCourseInstances(studentID);
        // opportunityUtils.clearPlannedOpportunityInstances(studentID);
        // const cis = CourseInstances.find({ studentID }).fetch();
        // const ays = AcademicYearInstances.find({ studentID }).fetch();
        // if (cis.length === 0) {
        //   _.map(ays, (year) => {
        //     AcademicYearInstances.removeIt(year._id);
        //   });
        // } else {
        //   // TODO: CAM figure out which AYs to remove.
        // }
        // if (student.desiredDegreeID) {
        //   const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
        //   if (degree.shortName.startsWith('B.S.')) {
        //     planUtils.generateBSDegreePlan(student, startSemester);
        //   }
        //   if (degree.shortName.startsWith('B.A.')) {
        //     planUtils.generateBADegreePlan(student, startSemester);
        //   }
        // }
      },
    }).modal('show');
  },
});

Template.Update_Degree_Plan_Widget.onCreated(function updateDegreePlanWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Update_Degree_Plan_Widget.onRendered(function updateDegreePlanWidgetOnRendered() {
  // add your statement here
});

Template.Update_Degree_Plan_Widget.onDestroyed(function updateDegreePlanWidgetOnDestroyed() {
  // add your statement here
});

