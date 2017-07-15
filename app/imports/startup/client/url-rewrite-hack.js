/* global window */

/**
 * There is a bug in FlowRouter's url encoding that results in '@' characters being replaced by '%2540'.
 * This hack rewrites the URL to replace all occurrences of %2540 with @.
 */
function fixPath() {
  const fixedPathName = window.location.pathname.replace(new RegExp('%2540', 'g'), '@');
  window.history.replaceState(null, null, fixedPathName);
}

window.addEventListener('click', () => fixPath());
window.addEventListener('pageshow', () => fixPath());
window.addEventListener('popstate', () => fixPath());
