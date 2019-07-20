import { moment } from 'meteor/momentjs:moment';
import { makeSampleDesiredDegree } from './SampleDesiredDegrees';
import { Slugs } from '../slug/SlugCollection';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';

export const sampleAcademicPlanName = 'B.S. in Computer Science (2019)';
export const sampleAcademicPlanShortName = 'B.S in C.S. (2019)';

export function makeSampleAcademicPlan() {
  const desiredDegreeID = makeSampleDesiredDegree();
  const degreeDoc = DesiredDegrees.findDoc(desiredDegreeID);
  const name = sampleAcademicPlanName;
  const shortName = sampleAcademicPlanShortName;
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `academic-plan-${uniqueString}`;
  const degreeSlug = Slugs.getNameFromID(degreeDoc.slugID);
  const description = 'Sample academic plan description';
  const semester = 'Fall-2019';
  const coursesPerSemester = [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0];
  const courseList = [
    'ics_111-1',
    'ics_141-1',
    'ics_211-1',
    'ics_241-1',
    'ics_311-1',
    'ics_314-1',
    'ics_212-1',
    'ics_321-1',
    'ics_312,ics_331-1',
    'ics_313,ics_361-1',
    'ics_332-1',
    'ics_400+-1',
    'ics_400+-2',
    'ics_400+-3',
    'ics_400+-4',
    'ics_400+-5',
  ];
  return AcademicPlans.define({
    name,
    shortName,
    slug,
    degreeSlug,
    description,
    semester,
    coursesPerSemester,
    courseList,
  });
}
