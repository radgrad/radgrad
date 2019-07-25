import { Template } from 'meteor/templating';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getRouteUserName } from './route-user-name';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';

Template.Favorite_Add.onCreated(function favoriteAddOnCreated() {
  // add your statement here
});

Template.Favorite_Add.helpers({
  typeCourse() {
    return (this.type === 'courses');
  },
});

Template.Favorite_Add.events({
  'click .jsAddCourse': function addCourseFavorite(event) {
    event.preventDefault();
    console.log(Template.instance());
    const collectionName = FavoriteCourses.getCollectionName();
    const definitionData = {};
    definitionData.student = getRouteUserName();
    definitionData.course = Slugs.getNameFromID(Template.instance().data.item.slugID);
    // console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to add course to favorites', error);
      }
    });
  },
  'click .jsAddOpportunity': function addOpportunityFavorite(event) {
    event.preventDefault();
    const collectionName = FavoriteOpportunities.getCollectionName();
    const definitionData = {};
    definitionData.student = getRouteUserName();
    definitionData.opportunity = Slugs.getNameFromID(Template.instance().data.item.slugID);
    // console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to add opportunity to favorites', error);
      }
    });
  },
});

Template.Favorite_Add.onRendered(function favoriteAddOnRendered() {
  // add your statement here
});

Template.Favorite_Add.onDestroyed(function favoriteAddOnDestroyed() {
  // add your statement here
});

