import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import {  } from '../../components/shared/route-user-name.js';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Log_Widget.helpers({
  logs() {
    return AdvisorLogs.find({ studentID: getUserIdFromRoute() });
  },
});

Template.Student_Log_Widget.onCreated(function studentLogWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(AdvisorLogs.getPublicationName());
});
