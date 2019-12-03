import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { isLabel } from '../../utilities/template-helpers';
import { Teasers } from '../../../api/teaser/TeaserCollection';

Template.Landing_Explorer_CareerGoals_Widget.helpers({
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  hasTeaser(item) {
    const teaser = Teasers.find({ targetSlugID: item.slugID }).fetch();
    return teaser.length > 0;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestSlugName(interestSlugName) {
    const { slugID } = Interests.findDoc(interestSlugName);
    return Slugs.getNameFromID(slugID);
  },
  isLabel,
  toUpper(string) {
    return string.toUpperCase();
  },
});
