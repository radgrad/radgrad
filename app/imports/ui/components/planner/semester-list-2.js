import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
import { appLog } from '../../../api/log/AppLogCollection';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';

Template.Semester_List_2.onCreated(function semesterListOnCreate() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});

Template.Semester_List_2.helpers({
  dictionary() {
    return Template.instance().state;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().data.semester) {
      return CourseInstances.find({
        studentID: getUserIdFromRoute(),
        note: /ICS|EE|CEE|ME|OE|BE/,
        semesterID: Template.instance().data.semester._id,
      }, { sort: { note: 1 } }).fetch();
    }
    return ret;
  },
  localState() {
    return Template.instance().localState;
  },
  opportunityName(opportunityID) {
    const opp = OpportunityInstances.findDoc({ _id: opportunityID });
    if (opp) {
      const opportunity = Opportunities.findDoc({ _id: opp.opportunityID });
      if (opportunity) {
        const name = opportunity.name;
        if (name.length > 20) {
          return `${name.substring(0, 16)}...`;
        }
        return name;
      }
    }
    return null;
  },
  semesterOpportunities() {
    if (getRouteUserName()) {
      if (Template.instance().data.semester) {
        const opps = OpportunityInstances.find({
          semesterID: Template.instance().data.semester._id,
          studentID: getUserIdFromRoute(),
        }).fetch();
        _.forEach(opps, (opp) => {
          opp.name = Opportunities.findDoc(opp.opportunityID).name; // eslint-disable-line
        });
        return opps;
      }
    }
    return [];
  },
  year() {
    const semester = Template.instance().localState.get('semester');
    if (semester) {
      return semester.year;
    }
    return null;
  },
});

Template.Semester_List_2.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const slug = event.originalEvent.dataTransfer.getData('slug');
      const instance = Template.instance();
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
              defineMethod.call({ collectionName, definitionData }, (error) => {
                if (!error) {
                  FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
                  FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                  FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                  const semesterName = Semesters.toString(semesterID);
                  const opportunity = Opportunities.findDoc(opportunityID);
                  // eslint-disable-next-line
                  const message = `${username} added ${opportunity.name} (${semesterName}) to their Degree Plan.`;
                  appLog.info(message);
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
      if (CourseInstances.isDefined(target.id)) {
        const ci = CourseInstances.findDoc(target.id);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, ci);
        template.state.set(plannerKeys.detailICE, ci.ice);
        const course = Courses.findDoc(ci.courseID);
        const semester = Semesters.toString(ci.semesterID);
        const message = `${getRouteUserName()} inspected ${ci.note} ${course.shortName} (${semester}).`;
        appLog.info(message);
        getFutureEnrollmentMethod.call(ci.courseID, (error, result) => {
          if (error) {
            console.log('Error in getting future enrollment', error);
          } else
            if (course._id === result.courseID) {
              template.state.set(plannerKeys.plannedEnrollment, result);
            }
        });
      } else
        if (Courses.isDefined(target.id)) {
          const course = Courses.findDoc(target.id);
          template.state.set(plannerKeys.detailCourse, course);
          template.state.set(plannerKeys.detailCourseInstance, null);
        } else {
          template.state.set(plannerKeys.detailCourse, null);
        }
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    } else
      if (firstClass === 'opportunityInstance') {
        if (OpportunityInstances.isDefined(target.id)) {
          const oi = OpportunityInstances.findDoc(target.id);
          template.state.set(plannerKeys.detailOpportunity, null);
          template.state.set(plannerKeys.detailOpportunityInstance, oi);
          template.state.set(plannerKeys.detailICE, oi.ice);
          const opportunity = Opportunities.findDoc(oi.opportunityID);
          const semester = Semesters.toString(oi.semesterID);
          const message = `${getRouteUserName()} inspected ${opportunity.name} (${semester}).`;
          appLog.info(message);
        } else
          if (Opportunities.isDefined(target.id)) {
            const opportunity = Opportunities.findDoc(target.id);
            template.state.set(plannerKeys.detailOpportunity, opportunity);
            template.state.set(plannerKeys.detailOpportunityInstance, null);
          } else {
            template.state.set(plannerKeys.detailOpportunity, null);
            template.state.set(plannerKeys.detailOpportunityInstance, null);
          }
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
      }
  },
});

Template.Semester_List_2.onRendered(function semesterListOnRendered() {
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
});
