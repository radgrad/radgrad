import { AdvisorChoices } from '../../../api/advisor/AdvisorChoiceCollection';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection';

export const advisorStudentTitle = () => {
  const advisorID = SessionState.get(sessionKeys.CURRENT_ADVISOR_ID);
  console.log(SessionState);
  if (AdvisorChoices.find({ advisorID }).count() === 1) {
    const choices = AdvisorChoices.find({ advisorID }).fetch()[0];
    if (choices.studentID) {
      const student = Users.findDoc(choices.studentID);
      return `${Users.getFullName(student._id)} (Student)`;
    }
  }
  return 'No student selected';
};

