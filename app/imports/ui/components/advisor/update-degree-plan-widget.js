/* global FileReader */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AcademicPlans } from '../../../api/degree/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import * as planUtils from '../../../api/degree-program/plan-generator';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import * as courseUtils from '../../../api/course/CourseUtilities';
import * as opportunityUtils from '../../../api/opportunity/OpportunityUtilities';

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
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
});

Template.Update_Degree_Plan_Widget.onCreated(function updateDegreePlanWidgetOnCreated() {
  this.chosenYear = new ReactiveVar('');
  FormUtils.setupFormWidget(this, updateSchema);
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(5), this.data.studentID.get());
    this.subscribe(AcademicYearInstances.getPublicationName(1), this.data.studentID.get());
    this.subscribe(OpportunityInstances.getPublicationName(3), this.data.studentID.get());
  });
});

Template.Update_Degree_Plan_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  declaredSemesters() {
    return Semesters.find({});
  },
  desiredDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } });
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  plans() {
    const ret = [];
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      if (user.academicPlanID) {
        const plan = AcademicPlans.findDoc(user.academicPlanID);
        const semester = Semesters.findDoc(plan.effectiveSemesterID);
        const plans = AcademicPlans.find().fetch();
        _.map(plans, (p) => {
          const year = Semesters.findDoc(p.effectiveSemesterID).year;
          if (semester.year === year) {
            ret.push(p);
          }
        });

      } else {
        const chosen = parseInt(Template.instance().chosenYear.get(), 10);
        const plans = AcademicPlans.find().fetch();
        _.map(plans, (p) => {
          const year = Semesters.findDoc(p.effectiveSemesterID).year;
          if (chosen === year) {
            ret.push(p);
          }
        });
      }
      return _.sortBy(ret, [function sort(o) {
        return o.name;
      }]);
    }
    return ret;
  },
  roles() {
    return [ROLE.STUDENT, ROLE.ALUMNI];
  },
  selectedCareerGoalIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.careerGoalIDs;
    }
    return '';
  },
  selectedDeclaredSemesterID() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.declaredSemesterID;
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
  selectedInterestIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.interestIDs;
    }
    return '';
  },
  selectedPlan() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      if (user.academicPlanID) {
        return AcademicPlans.findDoc(user.academicPlanID).name;
      }
    }
    return '';
  },
  selectedYear() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      if (user.academicPlanID) {
        const plan = AcademicPlans.findDoc(user.academicPlanID);
        const semester = Semesters.findDoc(plan.effectiveSemesterID);
        return semester.year;
      }
    }
    return '';
  },
  selectedRole() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return user.roles[0];
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
  slug() {
    if (Template.currentData().studentID.get()) {
      const user = Users.findDoc(Template.currentData().studentID.get());
      return Slugs.findDoc(user.slugID).name;
    }
    return '';
  },
  user() {
    if (Template.currentData().studentID.get()) {
      return Users.findDoc(Template.currentData().studentID.get());
    }
    return '';
  },
  years() {
    const ret = [];
    if (Template.currentData().studentID.get()) {
      const studentID = Template.currentData().studentID.get();
      const student = Users.findDoc({ _id: studentID });
      let declaredYear;
      if (student.declaredSemesterID) {
        const decSem = Semesters.findDoc(student.declaredSemesterID);
        declaredYear = decSem.year;
      }
      const plans = AcademicPlans.find().fetch();
      _.map(plans, (p) => {
        const year = Semesters.findDoc(p.effectiveSemesterID).year;
        if (declaredYear && year >= declaredYear) {
          if (_.indexOf(ret, year) === -1) {
            ret.push(year);
          }
        } else
          if (!declaredYear && _.indexOf(ret, year) === -1) {
            ret.push(year);
          }
      });
      return _.sortBy(ret, [function sort(o) {
        return o;
      }]);
    }
    return ret;
  },
});

Template.Update_Degree_Plan_Widget.events({
  'click .jsGeneratePlan': function clickGeneratePlan(event, instance) {
    event.preventDefault();
    // debugger
    instance.$('.ui.basic.modal').modal({
      detachable: false,
      onApprove() {
        // debugger
        const studentID = instance.data.studentID.get();
        const student = Users.findDoc(studentID);
        const currentSemester = Semesters.getCurrentSemesterDoc();
        const selectedSemesterID = instance.$('#planningSemester').val();
        let startSemester;
        if (selectedSemesterID) {
          startSemester = Semesters.findDoc(selectedSemesterID);
        } else {
          startSemester = currentSemester;
        }
        if (currentSemester.sortBy === startSemester.sortBy) {
          startSemester = semUtils.nextFallSpringSemester(startSemester);
        }
        // TODO: CAM do we really want to blow away the student's plan. What if they've made changes?
        courseUtils.clearPlannedCourseInstances(studentID);
        opportunityUtils.clearPlannedOpportunityInstances(studentID);
        const cis = CourseInstances.find({ studentID }).fetch();
        const ays = AcademicYearInstances.find({ studentID }).fetch();
        if (cis.length === 0) {
          _.map(ays, (year) => {
            AcademicYearInstances.removeIt(year._id);
          });
        } else {
          // TODO: CAM figure out which AYs to remove.
        }
        if (student.desiredDegreeID) {
          const degree = DesiredDegrees.findDoc({ _id: student.desiredDegreeID });
          if (degree.shortName.startsWith('B.S.')) {
            planUtils.generateBSDegreePlan(student, startSemester);
          }
          if (degree.shortName.startsWith('B.A.')) {
            planUtils.generateBADegreePlan(student, startSemester);
          }
          FeedbackFunctions.checkPrerequisites(studentID);
          FeedbackFunctions.checkCompletePlan(studentID);
          FeedbackFunctions.generateRecommendedCourse(studentID);
          FeedbackFunctions.checkOverloadedSemesters(studentID);
          FeedbackFunctions.generateNextLevelRecommendation(studentID);
        }
      },
    }).modal('show');
  },
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    console.log(updatedData);
    if (instance.context.isValid()) {
      const oldRole = Roles.getRolesForUser(Template.currentData().studentID.get());
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'careerGoals', 'careerGoalIDs');
      FormUtils.renameKey(updatedData, 'desiredDegree', 'desiredDegreeID');
      FormUtils.renameKey(updatedData, 'declaredSemester', 'declaredSemesterID');
      FormUtils.renameKey(updatedData, 'academicPlan', 'academicPlanID');
      FormUtils.renameKey(updatedData, 'slug', 'username');
      Meteor.call('Users.update', updatedData, (error) => {
        if (error) {
          // console.log('Error during user update: ', error);
        }
        // FormUtils.indicateSuccess(instance, event);
        instance.successClass.set('success');
        instance.errorClass.set('');
      });
      if (oldRole !== updatedData.role) {
        Users.updateRole(Template.currentData().studentID.get(), [updatedData.role], oldRole);
      }
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'change [name=year]': function changeYear(event, instance) {
    event.preventDefault();
    instance.successClass.set('');
    instance.errorClass.set('');
    Template.instance().chosenYear.set($(event.target).val());
  },
  change(event, instance) {
    instance.successClass.set('');
    instance.errorClass.set('');
  },
  keypress(event, instance) {
    instance.successClass.set('');
    instance.errorClass.set('');
  },
  // 'click .jsCancel': FormUtils.processCancelButtonClick,
});
