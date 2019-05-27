import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { MentorProfiles } from '../user/MentorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { ROLE } from '../role/Role';

function makeSampleStudent() {
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const username = `student-${uniqueString}@hawaii.edu`;
  const firstName = 'Amy';
  const lastName = 'Takayesu';
  const picture = 'amy.jpg';
  const website = 'http://amytaka.github.io';
  const interests = [];
  const careerGoals = [];
  const level = 6;
  const declaredSemester = 'Spring-2017';
  const profileID = StudentProfiles.define({
    username, firstName, lastName, picture, website, interests,
    careerGoals, level, declaredSemester,
  });
  return StudentProfiles.getUserID(profileID);
}

function makeSampleMentor() {
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const username = `mentor-${uniqueString}@hawaii.edu`;
  const firstName = 'Robert';
  const lastName = 'Brewer';
  const picture = 'foo.jpg';
  const website = 'http://rbrewer.github.io';
  const interests = [];
  const careerGoals = [];
  const company = 'Tableau Inc';
  const career = 'Software Engineer';
  const location = 'San Francisco, CA';
  const linkedin = 'robertsbrewer';
  const motivation = 'Help future students.';
  const profileID = MentorProfiles.define({
    username, firstName, lastName, picture, website, interests,
    careerGoals, company, career, location, linkedin, motivation,
  });
  return MentorProfiles.getUserID(profileID);
}

function makeSampleAdvisor() {
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const username = `advisor-${uniqueString}@hawaii.edu`;
  const firstName = 'Gerald';
  const lastName = 'Lau';
  const picture = 'glau.jpg';
  const website = 'http://glau.github.io';
  const interests = [];
  const careerGoals = [];
  const profileID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return AdvisorProfiles.getUserID(profileID);
}

function makeSampleFaculty() {
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const username = `faculty-${uniqueString}@hawaii.edu`;
  const firstName = 'Edo';
  const lastName = 'Biagioni';
  const picture = 'esb.jpg';
  const website = 'http://esb.github.io';
  const interests = [];
  const careerGoals = [];
  const profileID = FacultyProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return FacultyProfiles.getUserID(profileID);
}

/**
 * Creates a User based upon the specified role.
 * If role is not supplied, it defaults to ROLE.STUDENT.
 * @returns { String } The docID of the newly generated User.
 * @memberOf api/user
 */
export function makeSampleUser(role = ROLE.STUDENT) {
  if (role === ROLE.STUDENT) {
    return makeSampleStudent();
  }
  if (role === ROLE.FACULTY) {
    return makeSampleFaculty();
  }
  if (role === ROLE.ADVISOR) {
    return makeSampleAdvisor();
  }
  if (role === ROLE.MENTOR) {
    return makeSampleMentor();
  }
  throw new Meteor.Error(`Unexpected role: ${role}`, '', Error().stack);
}
