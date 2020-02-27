import { Template } from 'meteor/templating';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getRouteUserName } from './route-user-name';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Favorite_Button.onCreated(function favoriteButtonOnCreated() {
  // add your statement here
});

Template.Favorite_Button.helpers({
  favoriteCourse(item) {
    const favorite = FavoriteCourses.findNonRetired({ courseID: item._id });
    return favorite.length > 0;
  },
  favoriteOpportunity(item) {
    const favorite = FavoriteOpportunities.findNonRetired({ opportunityID: item._id });
    return favorite.length > 0;
  },
  typeCourse() {
    return (this.type === 'courses');
  },
});

Template.Favorite_Button.events({
  'click .jsAddCourse': function addCourseFavorite(event) {
    event.preventDefault();
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
    const interactionData = {
      username: definitionData.student,
      type: 'favoriteItem',
      typeData: `${definitionData.course} (Course)`,
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.error('Error creating UserInteraction', err);
      }
    });
  },
  'click .jsRemoveCourse': function deleteCourseFavorite(event) {
    event.preventDefault();
    const collectionName = FavoriteCourses.getCollectionName();
    const courseID = Template.instance().data.item._id;
    const slug = Courses.findSlugByID(courseID);
    const studentID = getUserIdFromRoute();
    const favorite = FavoriteCourses.findDoc({ studentID, courseID });
    removeItMethod.call({ collectionName, instance: favorite._id }, (error) => {
      if (error) {
        console.error('Failed to remove course from favorites', error);
      }
    });
    const interactionData = {
      username: getRouteUserName(),
      type: 'unFavoriteItem',
      typeData: `${slug} (Course)`,
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.error('Error creating UserInteraction', err);
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
    const interactionData = {
      username: definitionData.student,
      type: 'favoriteItem',
      typeData: `${definitionData.opportunity} (Opportunity)`,
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.error('Error creating UserInteraction', err);
      }
    });
  },
  'click .jsRemoveOpportunity': function removeOpportunityFavorite(event) {
    event.preventDefault();
    const collectionName = FavoriteOpportunities.getCollectionName();
    const opportunityID = Template.instance().data.item._id;
    const slug = Opportunities.findSlugByID(opportunityID);
    // console.log(slug);
    const studentID = getUserIdFromRoute();
    const favorite = FavoriteOpportunities.findDoc({ studentID, opportunityID });
    removeItMethod.call({ collectionName, instance: favorite._id }, (error) => {
      if (error) {
        console.error('Failed to remove favorite opportunity', error);
      }
    });
    const interactionData = {
      username: getRouteUserName(),
      type: 'unFavoriteItem',
      typeData: `${slug} (Opportunity)`,
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.error('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Favorite_Button.onRendered(function favoriteButtonOnRendered() {
  // add your statement here
});

Template.Favorite_Button.onDestroyed(function favoriteButtonOnDestroyed() {
  // add your statement here
});
