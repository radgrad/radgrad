import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Opportunities_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return Users.findDoc(user).picture;
  },
  userStatus(opportunity) {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  },
  teaserUrl(teaser) {
    return teaser.url;
  },
  opportunitySemesters(opp) {
    const semesters = opp.semesterIDs;
    const semesterNames = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    _.map(semesters, (sem) => {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        semesterNames.push(Semesters.toString(sem));
    }
  });
    return semesterNames;
  },
});

Template.Student_Explorer_Opportunities_Widget.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const opportunity = this.item;
    const semester = event.target.text;
    const oppSlug = Slugs.findDoc({ _id: opportunity.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const oi = {
      semester: semSlug,
      opportunity: oppSlug.name,
      verified: false,
      student: username,
    };
    OpportunityInstances.define(oi);
  },
});


Template.Student_Explorer_Opportunities_Widget.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed();
  }, 300);
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});

