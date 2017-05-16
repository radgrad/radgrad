import { Meteor } from 'meteor/meteor';

/** @module api/ics/IceProcessor */

/**
 * Polyfill definition of isInteger in case it's not defined.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger}
 * @type {*|Function}
 */
Number.isInteger = Number.isInteger ||
    function test(value) {
      return typeof value === 'number' &&
          isFinite(value) &&
          Math.floor(value) === value;
    };

export const gradeCompetency = {
  A: 10,
  B: 6,
  C: 0,
};

/**
 * Returns true if the object passed conforms to the ICE object specifications.
 * Note this does not test to see if additional fields are present.
 * @param obj The object, which must be an object with fields i, c, and e.
 * @returns {boolean} True if all fields are present and are numbers.
 */
export function isICE(obj) {
  return (((typeof obj) === 'object') && Number.isInteger(obj.i) && Number.isInteger(obj.c) && Number.isInteger(obj.e));
}

/**
 * Throws error if obj is not an ICE object.
 * @param obj The object to be tested for ICEness.
 * @throws { Meteor.Error } If obj is not ICE.
 */
export function assertICE(obj) {
  if ((obj === null) || (typeof obj !== 'object') || !(isICE(obj))) {
    throw new Meteor.Error(`${obj} was not an ICE object.`);
  }
}

/**
 * Returns an ICE object based upon the course slug and the passed grade.
 * If ICS course and an A, then return 9 competency points.
 * If ICE course and a B, then return 5 competency points.
 * Otherwise return zero points.
 * @param course The course slug. If 'other', then it's a non-ICS course.
 * @param grade The grade
 * @returns {{i: number, c: number, e: number}} The ICE object.
 */
export function makeCourseICE(course, grade) {
  // TODO: Hardcoding 'other' is a bad idea.
  let i = 0;
  let c = 0;
  const e = 0;
  // NonICS courses get no ICE points.
  if (course === 'other') {
    return { i, c, e };
  }
  // ICS499 gets experience and innovation points.
  if (course === 'ics499') {
    if (grade.includes('A') || grade.includes('B')) {
      i = 25;
      // TODO: Add experience points.
    }
  }
  // ICS courses get competency points if you get an A or a B.
  if (grade.includes('B')) {
    c = gradeCompetency.B;
  } else
    if (grade.includes('A')) {
      c = gradeCompetency.A;
    }
  return { i, c, e };
}

/**
 * Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
 * ICE values are counted only if verified is true.
 * @param docs An array of CourseInstance or OpportunityInstance documents.
 * @returns {{i: number, c: number, e: number}} The ICE object.
 */
export function getTotalICE(docs) {
  const total = { i: 0, c: 0, e: 0 };
  docs.map((instance) => {
    if (!(isICE(instance.ice))) {
      throw new Meteor.Error(`getTotalICE passed ${instance} without a valid .ice field.`);
    }
    if (instance.verified === true) {
      total.i += instance.ice.i;
      total.c += instance.ice.c;
      total.e += instance.ice.e;
    }
    return null;
  });
  return total;
}

/**
 * Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
 * ICE values are counted.
 * @param docs An array of CourseInstance or OpportunityInstance documents.
 * @returns {{i: number, c: number, e: number}} The ICE object.
 */
export function getPlanningICE(docs) {
  const total = { i: 0, c: 0, e: 0 };
  docs.map((instance) => {
    if (!(isICE(instance.ice))) {
      throw new Meteor.Error(`getPlanningICE passed ${instance} without a valid .ice field.`);
    }
    total.i += instance.ice.i;
    total.c += instance.ice.c;
    total.e += instance.ice.e;
    return null;
  });
  return total;
}

/**
 * Returns an ICE object that represents the earned ICE points from the passed Course\Opportunity Instance Documents.
 * ICE values are counted only if verified is true.
 * REPLACES getTotalICE!!!
 * @param docs An array of CourseInstance or OpportunityInstance documents.
 * @returns {{i: number, c: number, e: number}} The ICE object.
 */
export function getEarnedICE(docs) {
  const total = { i: 0, c: 0, e: 0 };
  docs.map((instance) => {
    if (!(isICE(instance.ice))) {
      throw new Meteor.Error(`getEarnedICE passed ${instance} without a valid .ice field.`);
    }
    if (instance.verified === true) {
      total.i += instance.ice.i;
      total.c += instance.ice.c;
      total.e += instance.ice.e;
    }
    return null;
  });
  return total;
}

/**
 * Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
 * ICE values are counted whether or not they are verified.
 * REPLACES getPlanningICE!
 * @param docs An array of CourseInstance or OpportunityInstance documents.
 * @returns {{i: number, c: number, e: number}} The ICE object.
 */
export function getProjectedICE(docs) {
  const total = { i: 0, c: 0, e: 0 };
  docs.map((instance) => {
    if (!(isICE(instance.ice))) {
      throw new Meteor.Error(`getProjectedICE passed ${instance} without a valid .ice field.`);
    }
    total.i += instance.ice.i;
    total.c += instance.ice.c;
    total.e += instance.ice.e;
    return null;
  });
  return total;
}
