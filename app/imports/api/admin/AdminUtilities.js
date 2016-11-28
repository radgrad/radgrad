import { Meteor } from 'meteor/meteor';
import { AdminChoices } from './AdminChoiceCollection';
import { Users } from '../user/UserCollection';


export const advisorTitle = () => {
  const adminID = Meteor.userId();
  if (AdminChoices.find({ adminID }).count() === 1) {
    const choices = AdminChoices.find({ adminID }).fetch()[0];
    if (choices.advisorID) {
      const advisor = Users.findDoc(choices.advisorID);
      return `${Users.getFullName(advisor._id)} (Advisor)`;
    }
  }
  return 'No advisor selected';
};

export const facultyTitle = () => {
  const adminID = Meteor.userId();
  if (AdminChoices.find({ adminID }).count() === 1) {
    const choices = AdminChoices.find({ adminID }).fetch()[0];
    if (choices.facultyID) {
      const faculty = Users.findDoc(choices.facultyID);
      return `${Users.getFullName(faculty._id)} (Faculty)`;
    }
  }
  return 'No faculty selected';
};

export const studentTitle = () => {
  const adminID = Meteor.userId();
  if (AdminChoices.find({ adminID }).count() === 1) {
    const choices = AdminChoices.find({ adminID }).fetch()[0];
    if (choices.studentID) {
      const student = Users.findDoc(choices.studentID);
      return `${Users.getFullName(student._id)} (Student)`;
    }
  }
  return 'No student selected';
};

export const mentorTitle = () => {
  const adminID = Meteor.userId();
  if (AdminChoices.find({ adminID }).count() === 1) {
    const choices = AdminChoices.find({ adminID }).fetch()[0];
    if (choices.mentorID) {
      const mentor = Users.findDoc(choices.mentorID);
      return `${Users.getFullName(mentor._id)} (Mentor)`;
    }
  }
  return 'No mentor selected';
};

