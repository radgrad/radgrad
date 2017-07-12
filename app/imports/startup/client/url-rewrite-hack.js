/* global window */

/**
 * There is a bug in FlowRouter's url encoding that results in '@' characters being replaced by '%2540'.
 * This hack rewrites the URL to replace any occurrences of %2540 with the @.
 */
function fixPath() {
  const fixedPathName = window.location.pathname.replace('%2540', '@');
  window.history.replaceState(null, null, fixedPathName);
}

window.addEventListener('click', () => fixPath());
window.addEventListener('pageshow', () => fixPath());
window.addEventListener('popstate', () => fixPath());
