/* global document */
// TODO this might need to go to the client test helper since it deals with the DOM.

/**
 * Returns the Elements in the DOM with the given attribute and  value.
 * @param attribute The div attribute
 * @param value the value.
 * @returns {Array}
 * @memberOf ui/utilities
 */
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

/**
 * Removes the element with the given id from the document.
 * @param id the id of the Element.
 * @memberOf ui/utilities
 */
export function removeElement(id) {
  const element = document.getElementById(id);
  if (element) {
    const parent = element.parentNode;
    parent.removeChild(element);
  }
}
