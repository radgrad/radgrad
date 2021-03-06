import { Tracker } from 'meteor/tracker';
import { UserStatus } from 'meteor/mizzao:user-status';
import '/imports/api/analytic';
import '/imports/api/base';
import '/imports/api/career';
import '/imports/api/course';
import '/imports/api/degree-plan';
import '/imports/api/favorite';
import '/imports/api/feed';
import '/imports/api/feedback';
import '/imports/api/help';
import '/imports/api/ice';
import '/imports/api/integrity';
import '/imports/api/interest';
import '/imports/api/level';
import '/imports/api/log';
import '/imports/api/mentor';
import '/imports/api/opportunity';
import '/imports/api/public-stats';
import '/imports/api/radgrad';
import '/imports/api/review';
import '/imports/api/role';
import '/imports/api/semester';
import '/imports/api/slug';
import '/imports/api/star';
import '/imports/api/teaser';
import '/imports/api/test';
import '/imports/api/user';
import '/imports/api/verification';

import '/imports/startup/client';
import '/imports/startup/both';

import '/imports/ui/components/admin';
import '/imports/ui/components/advisor';
import '/imports/ui/components/alumni';
import '/imports/ui/components/faculty';
import '/imports/ui/components/form-fields';
import '/imports/ui/components/landing';
import '/imports/ui/components/mentor';
import '/imports/ui/components/planner';
import '/imports/ui/components/shared';
import '/imports/ui/components/student';
import '/imports/ui/components/guidedtour';
import '/imports/ui/components/guidedtour/advisor';
import '/imports/ui/components/guidedtour/faculty';
import '/imports/ui/components/guidedtour/student';
import '/imports/ui/components/guidedtour/mentor';

import '/imports/ui/layouts/admin';
import '/imports/ui/layouts/advisor';
import '/imports/ui/layouts/alumni';
import '/imports/ui/layouts/faculty';
import '/imports/ui/layouts/landing';
import '/imports/ui/layouts/mentor';
import '/imports/ui/layouts/shared';
import '/imports/ui/layouts/student';
import '/imports/ui/layouts/guidedtour';

import '/imports/ui/pages/admin';
import '/imports/ui/pages/advisor';
import '/imports/ui/pages/alumni';
import '/imports/ui/pages/faculty';
import '/imports/ui/pages/landing';
import '/imports/ui/pages/mentor';
import '/imports/ui/pages/shared';
import '/imports/ui/pages/student';
import '/imports/ui/pages/guidedtour';


import '/imports/ui/utilities';

// import './lib/semantic-ui/semantic.min.css';
import './lib/semantic-ui/semantic.min.js';
import '../imports/ui/stylesheets/style.css';

// turn on Cam's debugging.
import '../imports/startup/client/cam-debugging';

Tracker.autorun(function (c) {
  try {
    UserStatus.startMonitor({
      threshold: 60000,
    });
    return c.stop();
  } catch (error) {
    // its ok?
  }
  return null;
});
