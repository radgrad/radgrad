import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

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
}, { tracker: Tracker });

const updateStudentSchema = new SimpleSchema({
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
  level: String,
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
}, { tracker: Tracker });

const updateMentorSchema = new SimpleSchema({
  username: { type: String, custom: FormUtils.slugFieldValidator },
  role: String,
  firstName: String,
  lastName: String,
  // Everything else is optional.
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  interests: { type: Array }, 'interests.$': String,
  // Optional Mentor fields
  company: { type: String, optional: true },
  career: { type: String, optional: true },
  location: { type: String, optional: true },
  linkedin: { type: String, optional: true },
  motivation: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_User_Widget.onCreated(function onCreated() {
  this.chosenYear = new ReactiveVar('');
  this.role = new ReactiveVar();
  const role = Users.getProfile(this.data.updateID.get()).role;
  this.role.set(role);
  if (role === ROLE.STUDENT || role === ROLE.ALUMNI) {
    FormUtils.setupFormWidget(this, updateStudentSchema);
  } else
    if (role === ROLE.MENTOR) {
      FormUtils.setupFormWidget(this, updateMentorSchema);
    } else {
      FormUtils.setupFormWidget(this, updateSchema);
    }
});

Template.Update_User_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  isMentor() {
    return Template.instance().role.get() === ROLE.MENTOR;
  },
  isStudent() {
    return Template.instance().role.get() === ROLE.STUDENT || Template.instance().role.get() === ROLE.ALUMNI;
  },
  roles() {
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN]));
  },
  selectedCareerGoalIDs() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.careerGoalIDs;
  },
  selectedDesiredDegreeID() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.desiredDegreeID;
  },
  selectedInterestIDs() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.interestIDs;
  },
  selectedRole() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.role;
  },
  selectedSemesterID() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.declaredSemesterID;
  },
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
  },
  slug() {
    const profile = Users.getProfile(Template.currentData().updateID.get());
    return profile.username;
  },
  user() {
    return Users.getProfile(Template.currentData().updateID.get());
  },
  userID() {
    return Template.currentData().updateID;
  },
});

Template.Update_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    let schema = updateSchema;
    const profile = Users.getProfile(Template.currentData().updateID.get());
    if (profile.role === ROLE.MENTOR) {
      schema = updateMentorSchema;
    }
    if (profile.role === ROLE.ALUMNI || profile.role === ROLE.STUDENT) {
      schema = updateStudentSchema;
    }
    const updateData = FormUtils.getSchemaDataFromEvent(schema, event);
    instance.context.reset();
    schema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      let collectionName;
      switch (profile.role) {
        case ROLE.ADVISOR:
          collectionName = AdvisorProfiles.getCollectionName();
          break;
        case ROLE.FACULTY:
          collectionName = FacultyProfiles.getCollectionName();
          break;
        case ROLE.MENTOR:
          collectionName = MentorProfiles.getCollectionName();
          break;
        default:
          collectionName = StudentProfiles.getCollectionName();
          updateData.isAlumni = (updateData.isAlumni === 'true');
          if (updateData.isAlumni) {
            updateData.role = ROLE.ALUMNI;
          } else {
            updateData.role = ROLE.STUDENT;
          }
      }
      updateData.id = profile._id;
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
