import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { plannerKeys } from './academic-plan';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/planner/Past_Semester_List */

Template.Past_Semester_List.onCreated(function pastSemesterListOnCreated() {
  if (this.data) {
    // use dictionary to indicate what is selected for the Inspector.
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});

Template.Past_Semester_List.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    console.log('pastSemester body drop', Template.instance().localState.get('semester'));
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const slug = event.originalEvent.dataTransfer.getData('slug');
      const instance = Template.instance();
      console.log(id, slug);
      if (slug) {
        const username = getRouteUserName();
        const semSlug = Slugs.getNameFromID(Template.instance().localState.get('semester').slugID);
        if (Slugs.isSlugForEntity(slug, 'Course')) {
          const courseID = Slugs.getEntityID(slug, 'Course');
          const course = Courses.findDoc(courseID);
          const collectionName = CourseInstances.getCollectionName();
          const definitionData = {
            semester: semSlug,
            course: slug,
            verified: false,
            fromSTAR: false,
            note: course.number,
            grade: 'B',
            student: username,
          };
          const semesterID = Template.instance().localState.get('semester')._id;
          if (CourseInstances.find({ courseID, studentID: getUserIdFromRoute(), semesterID }).count() === 0) {
            defineMethod.call({ collectionName, definitionData }, (error, res) => {
              if (!error) {
                FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
                FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                const ci = CourseInstances.findDoc(res);
                instance.state.set(plannerKeys.detailCourse, null);
                instance.state.set(plannerKeys.detailCourseInstance, ci);
                instance.state.set(plannerKeys.detailICE, ci.ice);
                const semesterName = Semesters.toString(semesterID);
                // eslint-disable-next-line
                const message = `${username} added ${course.number} ${course.shortName} (${semesterName}) to their Degree Plan.`;
                appLog.info(message);
                getFutureEnrollmentMethod.call(courseID, (err, result) => {
                  if (err) {
                    console.log('Error in getting future enrollment', error);
                  } else
                    if (courseID === result.courseID) {
                      instance.state.set(plannerKeys.plannedEnrollment, result);
                    }
                });
              }
            });
          }
        } else
          if (Slugs.isSlugForEntity(slug, 'Opportunity')) {
            const opportunityID = Slugs.getEntityID(slug, 'Opportunity');
            const semesterID = Template.instance().localState.get('semester')._id;
            const collectionName = OpportunityInstances.getCollectionName();
            const definitionData = {
              semester: semSlug,
              opportunity: slug,
              verified: false,
              student: username,
            };
            // eslint-disable-next-line
            if (OpportunityInstances.find({ opportunityID, studentID: getUserIdFromRoute(), semesterID }).count() === 0) {
              defineMethod.call({ collectionName, definitionData }, (error, res) => {
                if (!error) {
                  FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
                  FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                  FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                  const semesterName = Semesters.toString(semesterID);
                  const opportunity = Opportunities.findDoc(opportunityID);
                  // eslint-disable-next-line
                  const message = `${username} added ${opportunity.name} (${semesterName}) to their Degree Plan.`;
                  appLog.info(message);
                  const oi = OpportunityInstances.findDoc(res);
                  instance.state.set(plannerKeys.detailCourse, null);
                  instance.state.set(plannerKeys.detailCourseInstance, null);
                  instance.state.set(plannerKeys.detailICE, null);
                  instance.state.set(plannerKeys.detailOpportunityInstance, oi);
                  instance.state.set(plannerKeys.detailOpportunity, null);
                }
              });
            }
          }
      } else {
        const semesterID = Template.instance().localState.get('semester')._id;
        if (CourseInstances.isDefined(id)) {
          // There's gotta be a better way of doing this.
          const collectionName = CourseInstances.getCollectionName();
          const updateData = {};
          _.mapKeys(CourseInstances.findDoc(id), (value, key) => {
            if (key !== '_id') {
              updateData[key] = value;
            }
          });
          updateData.id = id;
          updateData.semesterID = semesterID;
          updateMethod.call({ collectionName, updateData }, (error) => {
            if (!error) {
              FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
              FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
              FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
              FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
              FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
              const semesterName = Semesters.toString(semesterID);
              const ci = CourseInstances.findDoc(id);
              const course = Courses.findDoc(ci.courseID);
              // eslint-disable-next-line
              const message = `${getRouteUserName()} moved ${course.number} ${course.shortName} to ${semesterName} in their Degree Plan.`;
              // console.log(message);
              appLog.info(message);
              getFutureEnrollmentMethod.call(course._id, (err, result) => {
                if (err) {
                  console.log('Error in getting future enrollment', error);
                } else
                  if (course._id === result.courseID) {
                    instance.state.set(plannerKeys.plannedEnrollment, result);
                  }
              });
            }
          });
        } else
          if (OpportunityInstances.isDefined(id)) {
            // There's gotta be a better way of doing this.
            const collectionName = OpportunityInstances.getCollectionName();
            const updateData = {};
            _.mapKeys(OpportunityInstances.findDoc(id), (value, key) => {
              if (key !== '_id') {
                updateData[key] = value;
              }
            });
            updateData.id = id;
            updateData.semesterID = semesterID;
            updateMethod.call({ collectionName, updateData }, (error) => {
              if (!error) {
                FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
                FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
                FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
                // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
                const semesterName = Semesters.toString(semesterID);
                const oi = OpportunityInstances.findDoc(id);
                const opportunity = Opportunities.findDoc(oi.opportunityID);
                // eslint-disable-next-line
                const message = `${getRouteUserName()} moved ${opportunity.name} to ${semesterName} in their Degree Plan.`;
                appLog.info(message);
              }
            });
          }
      }
    }
  },
  'click tr.clickEnabled': function clickTrClickEnabled(event) {
    event.preventDefault();
    let target = event.target;
    while (target && target.nodeName !== 'TR') {
      target = target.parentNode;
    }
    const firstClass = target.getAttribute('class').split(' ')[0];
    const template = Template.instance();
    if (firstClass === 'courseInstance') {
      const ci = template.data.icsCourses[target.id];
      template.state.set(plannerKeys.detailCourse, null);
      template.state.set(plannerKeys.detailCourseInstance, ci);
      template.state.set(plannerKeys.detailICE, ci.ice);
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
      const course = Courses.findDoc(ci.courseID);
      const semester = Semesters.toString(ci.semesterID);
      const message = `${getRouteUserName()} inspected ${ci.note} ${course.shortName} (${semester}).`;
      appLog.info(message);
    } else
      if (firstClass === 'opportunityInstance') {
        const oi = template.data.semesterOpportunities[target.id];
        template.state.set(plannerKeys.detailOpportunity, null);
        template.state.set(plannerKeys.detailOpportunityInstance, oi);
        template.state.set(plannerKeys.detailICE, oi.ice);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
        const opportunity = Opportunities.findDoc(oi.opportunityID);
        const semester = Semesters.toString(oi.semesterID);
        const message = `${getRouteUserName()} inspected ${opportunity.name} (${semester}).`;
        appLog.info(message);
      }
  },
});

Template.Past_Semester_List.onRendered(function pastSememsterListOnRendered() {
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
});
