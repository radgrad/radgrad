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

