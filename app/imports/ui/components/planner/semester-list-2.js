import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import {
  plannerKeys, resetDetails,
  showCourseDetails,
  showOpportunityDetails,
} from './academic-plan';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

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
  courseName(courseInstance) {
    const course = Courses.findDoc(courseInstance.courseID);
    return course.name;
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
            grade: '***',
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
                getFutureEnrollmentMethod.call(courseID, (err, result) => {
                  if (err) {
                    console.log('Error in getting future enrollment', error);
                  } else
                    if (courseID === result.courseID) {
                      instance.state.set(plannerKeys.plannedEnrollment, result);
                    }
                });
                const interactionData = { username, type: 'addCourse', typeData: slug };
                userInteractionDefineMethod.call(interactionData, (err) => {
                  if (err) {
                    console.log('Error creating UserInteraction', err);
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
                  const interactionData = { username, type: 'addOpportunity', typeData: slug };
                  userInteractionDefineMethod.call(interactionData, (err) => {
                    if (err) {
                      console.log('Error creating UserInteraction', err);
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
              FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
              FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
              FeedbackFunctions.checkOverloadedSemesters(getUserIdFromRoute());
              FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
              // FeedbackFunctions.generateRecommendedCurrentSemesterOpportunities(getUserIdFromRoute());
              const ci = CourseInstances.findDoc(id);
              const course = Courses.findDoc(ci.courseID);
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
        showCourseDetails(template.state, ci);
        // template.state.set(plannerKeys.detailCourse, ci);
        // template.state.set(plannerKeys.detailICE, ci.ice);
        // const course = Courses.findDoc(ci.courseID);
        // getFutureEnrollmentMethod.call(ci.courseID, (error, result) => {
        //   if (error) {
        //     console.log('Error in getting future enrollment', error);
        //   } else
        //     if (course._id === result.courseID) {
        //       template.state.set(plannerKeys.plannedEnrollment, result);
        //     }
        // });
      }
      // template.state.set(plannerKeys.detailOpportunity, null);
      // template.state.set(plannerKeys.detailOpportunityInstance, null);
    } else
      if (firstClass === 'opportunityInstance') {
        if (OpportunityInstances.isDefined(target.id)) {
          const oi = OpportunityInstances.findDoc(target.id);
          showOpportunityDetails(template.state, oi);
          // template.state.set(plannerKeys.detailOpportunity, oi);
          // template.state.set(plannerKeys.detailICE, oi.ice);
        }
        // template.state.set(plannerKeys.detailCourse, null);
        // template.state.set(plannerKeys.detailCourseInstance, null);
      }
  },
  'click .jsDelCourse': function clickJsDelCourse(event) {
    event.preventDefault();
    // console.log(event.target);
    const instance = event.target.id;
    console.log(`removing CourseInstance ${instance}`);
    const collectionName = CourseInstances.getCollectionName();
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.warn('Error removing CourseInstance %o', error);
      }
    });
    const template = Template.instance();
    resetDetails(template.state);
  },
  'click .jsDelOpp': function clickJsDelOpp(event) {
    event.preventDefault();
    // console.log(event.target);
    const instance = event.target.id;
    console.log(`removing OpportunityInstance ${instance}`);
    const collectionName = OpportunityInstances.getCollectionName();
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.warn('Error removing OpportunityInstance %o', error);
      }
    });
    const template = Template.instance();
    resetDetails(template.state);
  },
});

Template.Semester_List_2.onRendered(function semesterListOnRendered() {
  if (this.data) {
    this.localState.set('semester', this.data.semester);
    this.localState.set('currentSemester', this.data.currentSemester);
  }
  $('strong').popup();
});
