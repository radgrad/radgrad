import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../../components/shared/route-user-name';

Template.Student_Home_AboutMe_Page.helpers({
  getStudent() {
    console.log('getStudent', getRouteUserName());
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile;
    }
    return undefined;
  },
});

Template.Student_Home_AboutMe_Page.events({
  // add your statement here
});

Template.Student_Home_AboutMe_Page.onCreated(function studentHomeAboutMePageOnCreated() {
  // add your statement here
  console.log('About me page');
});

Template.Student_Home_AboutMe_Page.onRendered(function studentHomeAboutMePageOnRendered() {
  // add your statement here
});

Template.Student_Home_AboutMe_Page.onDestroyed(function studentHomeAboutMePageOnDestroyed() {
  // add your statement here
});

