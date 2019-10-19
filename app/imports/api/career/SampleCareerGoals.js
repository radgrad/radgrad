import { moment } from 'meteor/momentjs:moment';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';

export const sampleCareerGoalName = 'Sample Career Goal';

export function makeSampleCareerGoal() {
  const name = sampleCareerGoalName;
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `career-goal-${uniqueString}`;
  const description = 'Sample career goal description';
  const interests = [makeSampleInterest()];
  return CareerGoals.define({
    name, slug, description, interests,
  });
}
