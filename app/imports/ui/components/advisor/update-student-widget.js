import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { advisorLogsDefineMethod } from '../../../api/log/AdvisorLogCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import { calcLevel } from '../../../api/level/LevelProcessor';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { appLog } from '../../../api/log/AppLogCollection';

const updateSchema = new SimpleSchema({
  username: String,
  role: String,
  firstName: String,
  lastName: String,
  // Everything else is optional.
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  interests: { type: Array }, 'interests.$': String,
  // Optional Student fields
  isAlumni: String,
  level: Number,
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_Student_Widget.onCreated(function updateDegreePlanWidgetOnCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.autorun(() => {
    this.subscribe(CourseInstances.publicationNames.studentID, this.data.studentID.get());
    this.subscribe(AcademicYearInstances.publicationNames.PerStudentID, this.data.studentID.get());
    this.subscribe(OpportunityInstances.publicationNames.studentID, this.data.studentID.get());
  });
});

Template.Update_Student_Widget.helpers({
  calcLevel() {
    if (Template.currentData().studentID.get()) {
      return calcLevel(Template.currentData().studentID.get());
    }
    return 0;
  },
  hasNewLevel() {
    if (Template.currentData().studentID.get()) {
      const user = Users.getProfile(Template.currentData().studentID.get());
      return user.level !== calcLevel(Template.currentData().studentID.get());
    }
    return false;
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
        const declaredSemester = Semesters.findDoc(user.declaredSemesterID);
        const year = declaredSemester.term === Semesters.FALL ? declaredSemester.year : declaredSemester.year - 1;
        const lastFallID = Semesters.define({ term: Semesters.FALL, year });
        const semesterNum = Semesters.findDoc(lastFallID).semesterNumber;
        return AcademicPlans.find({ semesterNumber: { $gte: semesterNum } }).fetch();
      }
      return AcademicPlans.find().fetch();
    }
    return [];
  },
  roles() {
    return [ROLE.STUDENT];
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
      return user.username;
    }
    return '';
  },
  user() {
    if (Template.currentData().studentID.get()) {
      return Users.getProfile(Template.currentData().studentID.get());
    }
    return '';
  },
  falseValueAlumni() {
    if (Template.currentData().studentID.get()) {
      return !Users.getProfile(Template.currentData().studentID.get()).isAlumni;
    }
    return false;
  },
  trueValueAlumni() {
    if (Template.currentData().studentID.get()) {
      return Users.getProfile(Template.currentData().studentID.get()).isAlumni;
    }
    return true;
  },
});

Template.Update_Student_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    updateData.isAlumni = (updateData.isAlumni === 'true');
    if (instance.context.isValid()) {
      const profile = Users.getProfile(Template.currentData().studentID.get());
      if (updateData.level !== profile.level) {
        const text = `Congratulations! ${profile.firstName} you're now Level ${updateData.level}.
         Come by to get your RadGrad sticker.`;
        const student = Template.currentData().studentID.get();
        const advisor = getUserIdFromRoute();
        advisorLogsDefineMethod.call({ advisor, student, text }, (error) => {
          if (error) {
            console.log('Error creating AdvisorLog.', error);
          }
        });
        const feedData = {
          feedType: Feeds.NEW_LEVEL,
          user: profile.username,
          level: updateData.level,
        };
        defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
      }
      updateData.id = profile._id;
      if (updateData.isAlumni) {
        updateData.role = ROLE.ALUMNI;
      } else {
        updateData.role = ROLE.STUDENT;
      }
      const collectionName = StudentProfiles.getCollectionName();
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          appLog.error(`Error during user update: ${JSON.stringify(error)}`);
          console.log('Error during user update: ', error);
        } else {
          instance.successClass.set('success');
          instance.errorClass.set('');
          const advisor = getRouteUserName();
          const student = Users.getProfile(instance.data.studentID.get());
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
