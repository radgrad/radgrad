import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE, ROLES } from '../../../api/role/Role.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';


const addSchema = new SimpleSchema({
  username: { type: String, custom: FormUtils.slugFieldValidator },
  role: String,
  firstName: String,
  lastName: String,
  // Everything else is optional.
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  interests: { type: Array }, 'interests.$': String,
}, { tracker: Tracker });

const addStudentSchema = new SimpleSchema({
  username: { type: String, custom: FormUtils.slugFieldValidator },
  role: String,
  firstName: String,
  lastName: String,
  // Everything else is optional.
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  interests: { type: Array }, 'interests.$': String,
  // Optional Student fields
  isAlumni: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
}, { tracker: Tracker });

const addMentorSchema = new SimpleSchema({
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

Template.Add_User_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addStudentSchema);
  this.role = new ReactiveVar();
  this.role.set(ROLE.STUDENT);
});

Template.Add_User_Widget.helpers({
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
    return _.sortBy(_.difference(ROLES, [ROLE.ADMIN, ROLE.ALUMNI]));
  },
  selectedRole() {
    if (Template.instance().role.get()) {
      return Template.instance().role.get();
    }
    return ROLE.STUDENT;
  },
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: -1 } });
  },
});

Template.Add_User_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    let schema = addSchema;
    const role = Template.instance().role.get();
    if (role === ROLE.MENTOR) {
      schema = addMentorSchema;
    }
    if (role === ROLE.STUDENT) {
      schema = addStudentSchema;
    }
    const newData = FormUtils.getSchemaDataFromEvent(schema, event);
    instance.context.reset();
    schema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      let collectionName;
      switch (newData.role) {
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
          newData.level = 1;
          newData.isAlumni = (newData.isAlumni === 'true');
          if (newData.isAlumni) {
            newData.role = ROLE.ALUMNI;
          }
      }
      defineMethod.call({ collectionName, definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          const feedData = { feedType: Feeds.NEW_USER, user: newData.username };
          const feedCollectionName = Feeds.getCollectionName();
          defineMethod.call({ collectionName: feedCollectionName, definitionData: feedData });
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'change [name=role]': function changeRole(event) {
    event.preventDefault();
    const role = $(event.target).val();
    Template.instance().role.set(role);
    Template.instance().context = addSchema.namedContext('widget');
    if (role === ROLE.STUDENT || role === ROLE.ALUMNI) {
      Template.instance().context = addStudentSchema.namedContext('widget');
    }
    if (role === ROLE.MENTOR) {
      Template.instance().context = addMentorSchema.namedContext('widget');
    }
  },
});
