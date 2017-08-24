import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Reviews } from '../../../api/review/ReviewCollection';

Template.Admin_Layout.helpers({
  secondMenuItems() {
    let numMod = 0;
    numMod += MentorQuestions.find({ moderated: false }).fetch().length;
    numMod += Reviews.find({ moderated: false }).fetch().length;
    let moderationLabel = 'Moderation';
    if (numMod > 0) {
      moderationLabel = `${moderationLabel} (${numMod})`;
    }
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName, regex: 'home' },
      { label: 'Data Model', route: RouteNames.adminDataModelPageRouteName, regex: 'datamodel' },
      { label: 'Data Base', route: RouteNames.adminDataBasePageRouteName, regex: 'database' },
      { label: moderationLabel, route: RouteNames.adminModerationPageRouteName,
        regex: 'admin-moderation' },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
});
