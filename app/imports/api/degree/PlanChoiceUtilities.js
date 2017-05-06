/* global document */
import { _ } from 'meteor/erasaur:meteor-lodash';

/**
 * Strips of the counter for the plan choice. The counter is used in academic plans to keep track of how many
 * choices there are (e.g. five ics4xx in the B.S. degree).
 * @param planChoice the plan choice.
 * @returns {*}
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
 */
export function isSingleChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  return cleaned.indexOf(',') === -1;
}

/**
 * Returns true if the plan choice is a simple choice, just individual slugs separated by commas.
 * @param planChoice the plan choice.
 * @returns {boolean}
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
 */
export function isComplexChoice(planChoice) {
  const cleaned = stripCounter(planChoice);
  const parenp = cleaned.indexOf('(') !== -1;
  const orp = cleaned.indexOf(',') !== -1;
  return parenp && orp;
}

/**
 * Converts a complex choice into an array of the slugs that make up the choice.
 * Note: This may not be enough to solve the generate plan problem.
 * @param planChoice a plan choice.
 */
export function complexChoiceToArray(planChoice) {
  const cleaned = stripCounter(planChoice);
  const split = cleaned.split(',');
  const ret = [];
  _.map(split, (slug) => {
    if (slug.startsWith('(')) {
      ret.push(slug.substring(1));
    } else if (slug.endsWith(')')) {
      ret.push(slug.substring(0, slug.length - 1));
    } else {
      ret.push(slug);
    }
  });
  return ret;
}
export function buildSimpleName(slug) {
  const splits = slug.split(',');
  let ret = '';
  _.map(splits, (s) => {
    ret = `${ret}${s.substring(0, 3).toUpperCase()} ${s.substring(3)} or `;
  });
  return ret.substring(0, ret.length - 4);
}

export function getAllElementsWithAttribute(attribute, value) {
  const matchingElements = [];
  const allElements = document.getElementsByTagName('div');
  for (let i = 0, n = allElements.length; i < n; i += 1) {
    if (allElements[i].getAttribute(attribute) !== null && allElements[i].getAttribute(attribute) === value) {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

export function getDepartment(courseSlug) {
  const re = /^[A-Za-z]+/g;
  const result = re.exec(courseSlug);
  return result[0];
}

/**
 * Returns true if the courseSlug satisfies the plan choice.
 * @param planChoice The plan choice.
 * @param courseSlug The course slug.
 */
export function satisfiesPlanChoice(planChoice, courseSlug) {
  const dept = getDepartment(courseSlug);
  if (planChoice.includes('300')) {
    return courseSlug.startsWith(`${dept}3`) || courseSlug.startsWith(`${dept}4`);
  } else
    if (planChoice.includes('4xx')) {
      return courseSlug.startsWith(`${dept}4`);
    }
  return planChoice.indexOf(courseSlug) !== -1;
}

/**
 * Returns the index of the courseSlug in the array of plan choices.
 * @param planChoices an array of plan choices.
 * @param courseSlug the course slug.
 * @return the index of courseSlug in the array.
 */
export function planIndexOf(planChoices, courseSlug) {
  for (let i = 0; i < planChoices.length; i += 1) {
    if (satisfiesPlanChoice(planChoices[i], courseSlug)) {
      return i;
    }
  }
  return -1;
}
