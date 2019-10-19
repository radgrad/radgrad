import { SyncedCron } from 'meteor/percolate:synced-cron';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AdvisorProfiles } from '../../api/user/AdvisorProfileCollection';
import { sendEmail } from '../../api/analytic/Email';
import { Reviews } from '../../api/review/ReviewCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection';

function verifyNotification() {
  const pendingVerifications = VerificationRequests.find({ status: 'Open' }).fetch();
  if (pendingVerifications.length > 0) {
    const advisors = _.map(AdvisorProfiles.find().fetch(), 'username');
    _.each(advisors, function (advisor) {
      const emailData = {};
      emailData.to = advisor;
      emailData.bcc = '';
      emailData.from = 'radgrad@hawaii.edu';
      emailData.subject = 'RadGrad Notification: There Are Pending Verifications';
      emailData.templateData = {
        role: 'Advisors',
        message: `There are currently <span style="color: red;">${pendingVerifications.length}</span>`
        + ' pending verification requests. Please visit the'
        + ` <a href="https://radgrad.ics.hawaii.edu/advisor/${advisor}/verification-requests">`
        + ' verification request</a> page to review these requests.',
      };
      emailData.filename = 'notification.html';
      sendEmail(emailData);
    });
  }
}

function reviewNotification() {
  const pendingReviews = Reviews.find({ moderated: false }).fetch();
  if (pendingReviews.length > 0) {
    const admin = 'radgrad@hawaii.edu';
    const emailData = {};
    emailData.to = admin;
    emailData.bcc = '';
    emailData.from = 'radgrad@hawaii.edu';
    emailData.subject = 'RadGrad Notification: There Are Pending Reviews';
    emailData.templateData = {
      role: 'Admins',
      message: `There are currently <span style="color: red;">${pendingReviews.length}</span>`
      + ' pending reviews. Please visit the'
      + ` <a href="https://radgrad.ics.hawaii.edu/admin/${admin}/moderation">`
      + ' review</a> page to review these requests.',
    };
    emailData.filename = 'notification.html';
    sendEmail(emailData);
  }
}

SyncedCron.add({
  name: 'Send task notifications to admin and advisors',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text('every 24 hours');
  },
  job: function () {
    verifyNotification();
    reviewNotification();
  },
});
