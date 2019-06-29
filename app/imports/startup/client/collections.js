import { Mongo } from 'meteor/mongo';

// Client side only collections. There are publications that populate these collections, but these collections aren't
// on the server.
export const CourseScoreboard = new Mongo.Collection('CourseScoreboard');
export const OpportunityScoreboard = new Mongo.Collection('OpportunityScoreboard');
