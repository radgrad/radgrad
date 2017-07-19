import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/advisor/Add_Student_Widget */

const addSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  isAlumni: String,
  username: { type: String, custom: FormUtils.slugFieldValidator },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  // Everything else is optional.
  picture: { type: String, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  website: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
  academicPlan: { type: String, optional: true },
}, { tracker: Tracker });

Template.Add_Student_Widget.onCreated(function addstudentwidgetOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Student_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  plans() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const year = currentSemester.term === Semesters.FALL ? currentSemester.year : currentSemester.year - 1;
    const lastFallID = Semesters.define({ term: Semesters.FALL, year });
    const semesterNum = Semesters.findDoc(lastFallID).semesterNumber;
    return AcademicPlans.find({ semesterNumber: { $gte: semesterNum } }).fetch();
  },
  roles() {
    return [ROLE.STUDENT, ROLE.ALUMNI];
  },
  selectedSemesterID() {
    return Semesters.getCurrentSemester();
  },
  semesters() {
    return [Semesters.getCurrentSemesterDoc()];
  },
});

Template.Add_Student_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    console.log(newData);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      const collectionName = StudentProfiles.getCollectionName();
      newData.level = 1;  // new students start at level 1.
      newData.isAlumni = newData.isAlumni === 'true';
      defineMethod.call({ collectionName, definitionData: newData }, (error) => {
        if (error) {
          console.log('Error creating user', error);
          FormUtils.indicateError(instance, error);
        } else {
          const feedData = { feedType: Feeds.NEW_USER, user: newData.username };
          defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
          FormUtils.indicateSuccess(instance, event);
          const advisor = getRouteUserName();
          const message = `${advisor} added new student ${newData.username} ${JSON.stringify(newData)}`;
          appLog.info(message);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

Template.Add_Student_Widget.onRendered(function addstudentwidgetOnRendered() {
  // add your statement here
});

Template.Add_Student_Widget.onDestroyed(function addstudentwidgetOnDestroyed() {
  // add your statement here
});

