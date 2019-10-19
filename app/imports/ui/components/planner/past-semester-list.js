import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { plannerKeys, showCourseDetails, showOpportunityDetails } from './academic-plan';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Past_Semester_List.onCreated(function pastSemesterListOnCreated() {
  if (this.data) {
    // use dictionary to indicate what is selected for the Inspector.
    this.state = this.data.dictionary;
  }
  this.localState = new ReactiveDict();
});
Template.Past_Semester_List.helpers({
  courseName(courseInstance) {
    const course = Courses.findDoc(courseInstance.courseID);
    // console.log('courseName %o, %o', courseInstance, course);
    return course.name;
  },
  opportunityI(opportunityInstance) {
    const opp = Opportunities.findDoc(opportunityInstance.opportunityID);
    return opp.ice.i;
  },
  opportunityC(opportunityInstance) {
    const opp = Opportunities.findDoc(opportunityInstance.opportunityID);
    return opp.ice.c;
  },
  opportunityE(opportunityInstance) {
    const opp = Opportunities.findDoc(opportunityInstance.opportunityID);
    return opp.ice.e;
  },
});

Template.Past_Semester_List.events({
  'drop .bodyDrop': function dropBodyDrop(event) {
    event.preventDefault();
    // console.log('pastSemester body drop', Template.instance().localState.get('semester'));
    if (Template.instance().localState.get('semester')) {
      const id = event.originalEvent.dataTransfer.getData('text');
      const slug = event.originalEvent.dataTransfer.getData('slug');
      const instance = Template.instance();
      // console.log(id, slug);
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
                // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
                FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
                const ci = CourseInstances.findDoc(res);
                showCourseDetails(instance.state, ci);
                const interactionData = { username, type: 'addCourse', typeData: slug };
                userInteractionDefineMethod.call(interactionData, (err) => {
                  if (err) {
                    console.error('Error creating UserInteraction', err);
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
                // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
                // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
                FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
                FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
                const oi = OpportunityInstances.findDoc(res);
                showOpportunityDetails(instance.state, oi);
                const interactionData = { username, type: 'addOpportunity', typeData: slug };
                userInteractionDefineMethod.call(interactionData, (err) => {
                  if (err) {
                    console.error('Error creating UserInteraction', err);
                  }
                });
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
              // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
              FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
              FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
              const ci = CourseInstances.findDoc(id);
              const course = Courses.findDoc(ci.courseID);
              // console.log(message);
              getFutureEnrollmentMethod.call(course._id, (err, result) => {
                if (err) {
                  console.error('Error in getting future enrollment', error);
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
              // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
              FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
              FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
            }
          });
        }
      }
    }
  },
  'click tr.clickEnabled': function clickTrClickEnabled(event) {
    event.preventDefault();
    let { target } = event;
    while (target && target.nodeName !== 'TR') {
      target = target.parentNode;
    }
    const firstClass = target.getAttribute('class').split(' ')[0];
    const template = Template.instance();
    if (firstClass === 'courseInstance') {
      const ci = template.data.icsCourses[target.id];
      showCourseDetails(template.state, ci);
    } else
    if (firstClass === 'opportunityInstance') {
      const oi = template.data.semesterOpportunities[target.id];
      showOpportunityDetails(template.state, oi);
    }
  },
});

Template.Past_Semester_List.onRendered(function pastSememsterListOnRendered() {
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
  $('strong').popup();
});
