export function buildSimpleName(planChoiceSlug) {
  let ret = '';
  let slug = planChoiceSlug;
  while (slug.length > 0) {
    console.log(slug);
    let temp;
    let index;
    if (slug.startsWith('(')) {
      index = slug.indexOf(')');
      temp = slug.substring(1, index);
      if (index < slug.length - 2) {
        slug = slug.substring(index + 2); // skip over the ,
      } else {
        slug = '';
      }
    } else
      if (slug.indexOf(',') !== -1) {
        index = slug.indexOf(',');
        temp = slug.substring(0, index);
        slug = slug.substring(index + 1);
      } else {
        temp = slug;
        slug = '';
      }
    ret = `${ret}${buildSimpleName(temp)} or `;
  }
  return ret.substring(0, ret.length - 4);
}
