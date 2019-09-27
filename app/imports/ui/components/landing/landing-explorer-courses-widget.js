import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { isLabel } from '../../utilities/template-helpers';
import { Teasers } from '../../../api/teaser/TeaserCollection';

Template.Landing_Explorer_Courses_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    // console.log(courseSlugName);
    const slug = Slugs.findNonRetired({ name: courseSlugName });
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course.shortName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
  },
  hasTeaser(item) {
    const teaser = Teasers.findNonRetired({ targetSlugID: item.slugID });
    return teaser.length > 0;
  },
  isLabel,
  length(table) {
    return table.length !== 0;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
});
