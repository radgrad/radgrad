import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';

const addSchema = new SimpleSchema({
  title: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  author: String,
  url: String,
  description: String,
  targetSlug: String,
  duration: { type: String, optional: true },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
}, { tracker: Tracker });

Template.Add_Teaser_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Teaser_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  opportunities() {
    return Opportunities.findNonRetired({}, { sort: { name: 1 } });
  },
  slugs() {
    const opportunities = Opportunities.findNonRetired({});
    let opportunitySlugs = _.map(opportunities, (o) => Slugs.findDoc(o.slugID));
    opportunitySlugs = _.sortBy(opportunitySlugs, ['name']);
    const courses = Courses.findNonRetired({});
    let courseSlugs = _.map(courses, (c) => Slugs.findDoc(c.slugID));
    courseSlugs = _.sortBy(courseSlugs, ['name']);
    const careerGoals = CareerGoals.findNonRetired({});
    let careerGoalSlugs = _.map(careerGoals, (c) => Slugs.findDoc(c.slugID));
    careerGoalSlugs = _.sortBy(careerGoalSlugs, ['name']);
    const interests = Interests.findNonRetired({});
    let interestSlugs = _.map(interests, (i) => Slugs.findDoc(i.slugID));
    interestSlugs = _.sortBy(interestSlugs, ['name']);
    // return Slugs.findNonRetired({}, { sort: { name: 1 } });
    return opportunitySlugs.concat(courseSlugs.concat(interestSlugs.concat(careerGoalSlugs)));
  },
});

Template.Add_Teaser_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    // Need to clean the targetSlug. It includes the type.
    [newData.targetSlug] = newData.targetSlug.split(' ');
    console.log(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'TeaserCollection', definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
