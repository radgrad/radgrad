import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import * as RouteNames from '../../../startup/client/router.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

const edit = false;

const updateSchema = new SimpleSchema({
  website: { type: String, optional: true },
  company: { type: String, optional: true },
  career: { type: String, optional: true },
  location: { type: String, optional: true },
  linkedin: { type: String, optional: true },
  motivation: { type: String, optional: true },
  picture: { type: String, optional: true },
});

Template.Mentor_About_Me_Widget.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(edit, false);
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Mentor_About_Me_Widget.helpers({
  career() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ userID: getUserIdFromRoute() });
      return profile.career;
    }
    return 'No career specified.';
  },
  careerGoals() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return _.map(user.careerGoalIDs, (id) => CareerGoals.findDoc(id));
    }
    return [];
  },
  careerGoalsRouteName() {
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  company() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ userID: getUserIdFromRoute() });
      return profile.company;
    }
    return 'No company specified.';
  },
  degreesRouteName() {
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  desiredDegree() {
    let ret = '';
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      if (user.desiredDegreeID) {
        ret = DesiredDegrees.findDoc(user.desiredDegreeID).name;
      }
    }
    return ret;
  },
  edit() {
    return Template.instance().messageFlags.get(edit);
  },
  email() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return user.username;
    }
    return '';
  },
  firstCareerGoal() {
    let ret;
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      ret = Slugs.findDoc(careerGoals[0].slugID).name;
    }
    return ret;
  },
  firstDegree() {
    let ret;
    const degrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
    }
    return ret;
  },
  firstInterest() {
    let ret;
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  },
  getDictionary() {
    return Template.instance().state;
  },
  goalName(goal) {
    return goal.name;
  },
  interestName(interest) {
    return interest.name;
  },
  interests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return _.map(profile.interestIDs, (id) => Interests.findDoc(id));
    }
    return [];
  },
  interestsRouteName() {
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  linkedin() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ userID: getUserIdFromRoute() });
      return profile.linkedin;
    }
    return 'No linkedin profile specified';
  },
  location() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ userID: getUserIdFromRoute() });
      return profile.location;
    }
    return 'No location specified.';
  },
  motivation() {
    if (getRouteUserName()) {
      const profile = MentorProfiles.findDoc({ userID: getUserIdFromRoute() });
      return profile.motivation;
    }
    return 'No motivation specified.';
  },
  name() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return user.picture;
    }
    return 'No picture';
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  studentPicture() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return user.picture;
    }
    return 'No picture';
  },
  website() {
    if (getRouteUserName()) {
      const user = Users.getProfile(getRouteUserName());
      return user.website;
    }
    return '';
  },
});

Template.Mentor_About_Me_Widget.events({
  'click .editProfile': function submitMotivation(event, instance) {
    event.preventDefault();
    instance.messageFlags.set(edit, true);
  },

  submit: function submitDoneEdit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updatedData, { mutate: true });
    instance.context.validate(updatedData);
    const mentorProfile = MentorProfiles.findOne({ userID: getUserIdFromRoute() });
    if (instance.context.isValid()) {
      const collectionName = MentorProfiles.getCollectionName();
      updatedData.id = mentorProfile._id;
      updateMethod.call({ collectionName, updateData: updatedData }, (error) => {
        if (error) {
          console.log('Error updating MentorProfile', error);
        }
      });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
    instance.messageFlags.set(edit, false);
  },

  'click .cancel': function (event, instance) {
    event.preventDefault();
    instance.messageFlags.set(edit, false);
  },
});
