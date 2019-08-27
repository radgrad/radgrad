import { moment } from 'meteor/momentjs:moment';
import { DesiredDegrees } from './DesiredDegreeCollection';

export const sampleDesiredDegreeName = 'Bachelors of Science in Computer Science';
export const sampleDesiredDegreeShortName = 'B.S. CS';

export function makeSampleDesiredDegree(args) {
  const name = sampleDesiredDegreeName;
  const shortName = sampleDesiredDegreeShortName;
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `degree-${uniqueString}`;
  const description = args && args.description ? args.description : 'Sample desired degree description';
  return DesiredDegrees.define({ name, shortName, slug, description });
}
