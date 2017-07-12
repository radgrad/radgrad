import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import SimpleSchema from 'simpl-schema';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import { calcLevel } from '../../../api/level/LevelProcessor';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/advisor/Update_Degree_Plan_Widget */

const updateSchema = new SimpleSchema({
  slug: String, // will rename this to username
  firstName: String,
  lastName: String,
  role: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  careerGoals: [String],
  level: { type: Number, optional: true },
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_Degree_Plan_Widget.onCreated(function updateDegreePlanWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.autorun(() => {
    this.subscribe(CourseInstances.publicationNames.studentID, this.data.studentID.get());
    this.subscribe(AcademicYearInstances.publicationNames.PerStudentID, this.data.studentID.get());
    this.subscribe(OpportunityInstances.publicationNames.studentID, this.data.studentID.get());
  });
});

Template.Update_Degree_Plan_Widget.helpers({
  calcLevel() {
    if (Template.currentData().studentID.get()) {
      return calcLevel(Template.currentData().studentID.get());
    }
    return 0;
  },
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  declaredSemesters() {
    return Semesters.find({});
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  studentID() {
    return Template.currentData().studentID;
  },
  plans() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      if (user.declaredSemesterID) {
        const semesterNum = Semesters.findDoc(user.declaredSemesterID).semesterNumber;
        return AcademicPlans.find({ semesterNumber: { $gte: semesterNum } }).fetch();
      }
      return AcademicPlans.find().fetch();
    }
    return [];
  },
  roles() {
    return [ROLE.STUDENT, ROLE.ALUMNI];
  },
  selectedCareerGoalIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.careerGoalIDs;
    }
    return '';
  },
  selectedSemesterID() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.declaredSemesterID;
    }
    return '';
  },
  selectedDesiredDegreeID() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.desiredDegreeID;
    }
    return '';
  },
  selectedInterestIDs() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.interestIDs;
    }
    return '';
  },
  selectedPlan() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      if (user.academicPlanID) {
        return AcademicPlans.findDoc(user.academicPlanID).name;
      }
    }
    return '';
  },
  selectedYear() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
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
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.role;
    }
    return '';
  },
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: 1 } }).fetch();
  },
  slug() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return Slugs.findDoc(user.slugID).name;
    }
    return '';
  },
  user() {
    if (Template.currentData().studentID.get()) {
      return Users.getProfile(Template.currentData().studentID.get());
    }
    return '';
  },
});

Template.Update_Degree_Plan_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updateData, 'slug', 'username');
      updateData.id = Users.getProfile(Template.currentData().studentID.get())._id;
      const collectionName = StudentProfiles.getCollectionName();
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          appLog.error(`Error during user update: ${JSON.stringify(error)}`);
          console.log('Error during user update: ', error);
        } else {
          instance.successClass.set('success');
          instance.errorClass.set('');
          const advisor = getRouteUserName();
          const student = Users.getProfile(Template.currentData().studentID.get());
          const message = `${advisor} updated student ${student.username} ${JSON.stringify(updateData)}`;
          appLog.info(message);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  change(event, instance) {
    instance.successClass.set('');
    instance.errorClass.set('');
  },
  keypress(event, instance) {
    instance.successClass.set('');
    instance.errorClass.set('');
  },
  'click .jsCancel': function cancel(event, instance) {
    event.preventDefault();
    instance.data.studentID.set('');
  },
});
