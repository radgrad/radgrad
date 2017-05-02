/* global document */
import { _ } from 'meteor/erasaur:meteor-lodash';

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
