/** @module ui/components/admin/AdminUtilities */

/**
 * Returns a link element for opening URL in a new tab.
 * @param url The URL.
 * @returns {string} The 'a' element for opening the URL in a new tab.
 */
export function makeLink(url) {
  return (url) ? `<a target='_blank' href="${url}">${url}</a>` : '';
}
