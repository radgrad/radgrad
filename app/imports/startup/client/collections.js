import { Mongo } from 'meteor/mongo';

// Client side only collections. There are publications that populate these collections, but these collections aren't
// on the server.
export const CourseScoreboard = new Mongo.Collection('CourseScoreboard');
export const OpportunityScoreboard = new Mongo.Collection('OpportunityScoreboard');
export const CourseFavoritesScoreboard = new Mongo.Collection('CourseFavoritesScoreboard');
export const OpportunityFavoritesScoreboard = new Mongo.Collection('OpportunityFavoritesScoreboard');
export const AcademicPlanFavoritesScoreboard = new Mongo.Collection('AcademicPlanFavoritesScoreboard');
export const CareerGoalFavoritesScoreboard = new Mongo.Collection('CareerGoalFavoritesScoreboard');
export const InterestFavoritesScoreboard = new Mongo.Collection('InterestFavoritesScoreboard');
