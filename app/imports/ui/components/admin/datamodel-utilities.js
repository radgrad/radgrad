/**
 * Returns a link element for opening URL in a new tab.
 * @param url The URL.
 * @returns {string} The 'a' element for opening the URL in a new tab.
 * @memberOf ui/components/admin
 */
export function makeLink(url) {
  return (url) ? `<a target='_blank' href="${url}">${url}</a>` : '';
}

export const makeYoutubeLink = (url) => (url ? `<a target='_blank' href="https://youtu.be/${url}">${url}</a>` : '');
