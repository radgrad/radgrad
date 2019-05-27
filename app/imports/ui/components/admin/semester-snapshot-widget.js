import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SemesterSnapshots } from '../../../api/semester/SemesterSnapshotCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Semester_Snapshot_Widget.onCreated(function semesterSnapshotWidgetOnCreated() {
  this.subscribe(SemesterSnapshots.getPublicationName());
});

Template.Semester_Snapshot_Widget.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Semester_Snapshot_Widget.helpers({
  semesters() {
    const currentSemesterNum = Semesters.getCurrentSemesterDoc().semesterNumber;
    const semesterList = Semesters.find({
      semesterNumber: { $lte: currentSemesterNum } },
        { sort: { semesterNumber: -1 } });
    return semesterList;
  },
});

Template.Semester_Snapshot_Widget.events({
  'submit .ui.form': function createSnapshot(event) {
    event.preventDefault();
    const selectedSemesterID = event.target.dropdown.value;
    const selectedSemester = Semesters.findDoc(selectedSemesterID);
    const selectedSemesterNum = selectedSemester.semesterNumber;
    const courseInstancesForSemester = CourseInstances.find({
      semesterID: selectedSemesterID,
      fromSTAR: true,
    }).fetch();
    // Student population consists of students with an eligible course for the selected semester
    const studentPopulation = _.pluck(_.uniq(courseInstancesForSemester, false, course => course.studentID),
        'studentID');
    const yearOne = [];
    const yearTwo = [];
    const yearThree = [];
    const yearFour = [];
    const yearFive = [];
    const radGradActive = [];
    const radGradInactive = [];
    const copActive = [];
    const copInactive = [];
    // Ignore summer terms when considering grade level
    const prevSemesters = Semesters.find({
      semesterNumber: { $lt: selectedSemesterNum },
      term: { $ne: 'Summer' },
    }).fetch();
    const prevSemestersList = _.pluck(prevSemesters, '_id');
    _.each(studentPopulation, function (studentID) {
      /* Student's grade level for a given semester is determined by the number of semesters in which
      they have taken at least one verified course. 1-2 semesters is year one, 3-4 is year two, etc.
      For the gradeLevel calculation, the selected semester must also be added in as it is not included in
      prevSemesterList */
      const studentCourseInstances = CourseInstances.find({
        studentID: studentID,
        semesterID: { $in: prevSemestersList },
        verified: true, fromSTAR: true,
      }).fetch();
      console.log('User: ', Users.getFullName(studentID));
      console.log('Course instances: ', studentCourseInstances);
      //
      const gradeLevel = Math.ceil((_.uniq(_.pluck(studentCourseInstances, 'semesterID')).length + 1) / 2);
      console.log('Grade level: ', gradeLevel);
      switch (gradeLevel) {
        case 1:
          yearOne.push(studentID); break;
        case 2:
          yearTwo.push(studentID); break;
        case 3:
          yearThree.push(studentID); break;
        case 4:
          yearFour.push(studentID); break;
        case 5:
          yearFive.push(studentID); break;
        default:
          break;
      }
      /* Students are determined as radGradActive from specific interaction types during the semester, and
      if they have logged in at least once */
      const activeInteractionTypes = ['interestIDs', 'careerGoalIDs'];
      const userInteractions = UserInteractions.find({
        userID: studentID },
          { $or: [{ type: 'login' }, { type: { $in: activeInteractionTypes } }] })
          .fetch();
      if (_.contains(_.pluck(userInteractions, 'type'), 'login')) {
        // Filter interactions for the selected semester. These interactions must be from activeInteractionTypes
        const currentSemesterInteractions = _.pluck(_.filter(userInteractions, function (interaction) {
          let isActiveInteraction = false;
          if (Semesters.getSemester(interaction.timestamp) === selectedSemesterID) {
            isActiveInteraction = true;
          }
          return isActiveInteraction;
        }), 'type');
        const studentIsRadGradActive = _.some(activeInteractionTypes, type =>
            currentSemesterInteractions.includes(type));
        if (studentIsRadGradActive) {
          radGradActive.push(studentID);
        } else {
          radGradInactive.push(studentID);
        }
      } else {
        radGradInactive.push(studentID);
      }
    });
    console.log('year1: ', yearOne);
    console.log('year2: ', yearTwo);
    console.log('year3: ', yearThree);
    console.log('year4: ', yearFour);
    console.log('year5: ', yearFive);
    console.log('radGradActive: ', radGradActive);
    console.log('radGradInactive: ', radGradInactive);
  },
});
