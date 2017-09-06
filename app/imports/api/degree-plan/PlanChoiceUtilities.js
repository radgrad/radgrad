import { _ } from 'meteor/erasaur:meteor-lodash';

/**
 * Strips of the counter for the plan choice. The counter is used in academic plans to keep track of how many
 * choices there are (e.g. five ics400+ in the B.S. degree).
 * @param planChoice the plan choice.
 * @returns {*}
 * @memberOf api/degree-plan
 */
export function stripCounter(planChoice) {
  const index = planChoice.indexOf('-');
  if (index !== -1) {
    return planChoice.substring(0, index);
  }
  return planChoice;
}

/**
 * Returns true if the planChoice is a single choice.
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export function isSingleChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  return cleaned.indexOf(',') === -1;
}

/**
 * Returns true if the plan choice is a simple choice, just individual slugs separated by commas.
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export function isSimpleChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  const parenp = cleaned.indexOf('(') !== -1;
  const orp = cleaned.indexOf(',') !== -1;
  return !parenp && orp;
}

/**
 * Returns true if the plan choice includes a sub-choice (e.g. '(ics313,ics331),ics355-1' )
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export function isComplexChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  const parenp = cleaned.indexOf('(') !== -1;
  const orp = cleaned.indexOf(',') !== -1;
  return parenp && orp;
}

/**
 * Returns true if the planChoice is a 300+ or 400+.
 * @param planChoice the plan choice.
 * @return {boolean}
 * @memberOf api/degree-plan
 */
export function isXXChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  return cleaned.indexOf('+') !== -1;
}

/**
 * Converts a complex choice into an array of the slugs that make up the choice.
 * Note: This may not be enough to solve the generate plan problem.
 * @param planChoice a plan choice.
 * @memberOf api/degree-plan
 */
export function complexChoiceToArray(planChoice) {
  const cleaned = stripCounter(planChoice);
  const split = cleaned.split(',');
  return _.map(split, (slug) => {
    if (slug.startsWith('(')) {
      return slug.substring(1);
    } else if (slug.endsWith(')')) {
      return slug.substring(0, slug.length - 1);
    }
    return slug;
  });
}

/**
 * Creates the course name from the slug. Course names have department in all caps.
 * @param slug the course slug.
 * @returns {string}
 * @memberOf api/degree-plan
 */
export function buildCourseSlugName(slug) {
  const splits = slug.split('_');
  return `${splits[0].toUpperCase()} ${splits[1]}`;
}

/**
 * Builds the Name for a simple planChoice. Will have commas replaced by ' or '.
 * @param slug the simple plan choice.
 * @returns {string}
 * @memberOf api/degree-plan
 */
export function buildSimpleName(slug) {
  const splits = slug.split(',');
  let ret = '';
  _.forEach(splits, (s) => {
    ret = `${ret}${buildCourseSlugName(s)} or `;
  });
  return ret.substring(0, ret.length - 4);
}

/**
 * Returns the department from a course slug.
 * @param courseSlug
 * @returns {*}
 * @memberOf api/degree-plan
 */
export function getDepartment(courseSlug) {
  let slug = courseSlug;
  if (courseSlug.startsWith('(')) {
    slug = courseSlug.substring(1);
  }
  const result = slug.split('_');
  return result[0];
}

/**
 * Returns an array of the departments in the plan choice.
 * @param planChoice The plan choice.
 * @returns {Array}
 * @memberOf api/degree-plan
 */
export function getDepartments(planChoice) {
  const choices = planChoice.split(',');
  const ret = [];
  _.forEach(choices, (c) => {
    const dept = getDepartment(c);
    if (_.indexOf(ret, dept) === -1) {
      ret.push(dept);
    }
  });
  return ret;
}

/**
 * Returns true if the courseSlug satisfies the planChoice.
 * @param planChoice a plan choice.
 * @param courseSlug a course's slug.
 * @returns {*}
 * @memberOf api/degree-plan
 */
function satisfiesSinglePlanChoice(planChoice, courseSlug) {
  const dept = getDepartment(planChoice);
  if (planChoice.includes('300+')) {
    return courseSlug.startsWith(`${dept}_3`) || courseSlug.startsWith(`${dept}_4`);
  } else
    if (planChoice.includes('400+')) {
      return courseSlug.startsWith(`${dept}_4`);
    }
  return planChoice.indexOf(courseSlug) !== -1;
}

/**
 * Returns true if the courseSlug satisfies the plan choice.
 * @param planChoice The plan choice.
 * @param courseSlug The course slug.
 * @return {Boolean}
 * @memberOf api/degree-plan
 */
export function satisfiesPlanChoice(planChoice, courseSlug) {
  const singleChoices = planChoice.split(',');
  let ret = false;
  _.forEach(singleChoices, (choice) => {
    if (satisfiesSinglePlanChoice(choice, courseSlug)) {
      ret = true;
    }
  });
  return ret;
}

/**
 * Returns the index of the courseSlug in the array of plan choices.
 * @param planChoices an array of plan choices.
 * @param courseSlug the course slug.
 * @return {Number} the index of courseSlug in the array.
 * @memberOf api/degree-plan
 */
export function planIndexOf(planChoices, courseSlug) {
  for (let i = 0; i < planChoices.length; i += 1) {
    if (satisfiesPlanChoice(planChoices[i], courseSlug)) {
      return i;
    }
  }
  return -1;
}
