import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionsCollection.js';
import { MentorAnswers } from '../../../api/mentor/MentorAnswersCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

Template.Student_MentorSpace_Page.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
    this.subscribe(Courses.getPublicationName());
    this.subscribe(CourseInstances.getPublicationName());
    this.subscribe(Feedbacks.getPublicationName());
    this.subscribe(FeedbackInstances.getPublicationName());
    this.subscribe(Interests.getPublicationName());
    this.subscribe(MentorQuestions.getPublicationName());
    this.subscribe(MentorAnswers.getPublicationName());
    this.subscribe(Opportunities.getPublicationName());
    this.subscribe(OpportunityInstances.getPublicationName());
    this.subscribe(Semesters.getPublicationName());
    this.subscribe(Users.getPublicationName());
    this.subscribe(AcademicYearInstances.getPublicationName());
    this.subscribe(VerificationRequests.getPublicationName());
  });
});

Template.Student_MentorSpace_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.

  listQuestions() {
    return MentorQuestions.find({});
  },

  listMentors() {
    return [{
      name: 'Robert Brewer',
      title: 'Software Engineer, Tableau',
      location: 'Palo Alto, CA',
      email: 'rbrewer@excitedcuriosity.org',
      linkedin: 'robertsbrewer',
      mentor_reason: 'I founded a startup in Hawaii and now work in Silicon Valley. I am happy to share my ' +
      'experiences with new grads.',
      image: 'brewer.jpg',
    }, {
      name: 'Jennifer Geis',
      title: 'IT Specialist, UH',
      location: 'Honolulu, HI',
      email: 'jgeis@hawaii.edu',
      linkedin: 'jgeis',
      mentor_reason: 'I received both a B.S. and M.S. in Computer Science from UH. I\'ve worked in the private ' +
      'sector and done the start-up thing and now work at UH Information and Technology Services. Being from ' +
      'Hawaii my goal was to orient my career so I could stay here and I\'ve learned some lessons along the way. ' +
      'My experiences could prove useful to you if: (a) you want to talk about getting the most out of your UH ICS ' +
      'experience, or (b) you are interested in one day working for UH, or (c) staying in Hawaii is one of your goals.',
      image: 'geis.jpg',
    }, {
      name: 'Austen Ito',
      title: 'Software Engineer, Bonobos',
      location: 'New York City, NY',
      email: 'austen.ito@gmail.com',
      linkedin: 'austen-ito-9a561a9',
      mentor_reason: 'I graduated from ICS, helped start the first Honolulu Makerspace, have worked for Code Camps, ' +
      'and have held software jobs in DC, NYC, and HI. I can try to help you whether you intend to stay local or ' +
      'move to the mainland.',
      image: 'ito.png',
    }, {
      name: 'Aaron Kagawa',
      title: 'Software Engineer, LiveAction',
      location: 'Honolulu, HI',
      email: 'akagawa@liveaction.com',
      linkedin: 'aaronkagawa',
      mentor_reason: 'As an ICS undergrad and graduate student, I know how important mentoring can be to your ' +
      'career, and I hope I can help future ICS grads get off to a great start.',
      image: 'kagawa.jpg',
    }, {
      name: 'Patrick Karjala',
      title: 'CEO, Slickage Studios',
      location: 'Honolulu, HI',
      email: 'pkarjala@hawaii.edu',
      linkedin: 'patrickakarjala',
      mentor_reason: 'I completed my undergraduate CS degree in 2004, and am now enrolled in the UH ICS MS program.' +
      ' I currently work for the Distance Course Design and Consulting group at UH Manoa, doing full stack web ' +
      'application development. I am glad to answer questions regarding any topic of computer science, especially ' +
      'those geared toward collaborative development and networking (both computer and interpersonal).',
      image: 'karjala.jpg',
    }, {
      name: 'George Lee',
      title: 'Developer, Hobnob Invites',
      location: 'Honolulu, HI',
      email: 'gelee@hawaii.edu',
      linkedin: 'keokilee',
      mentor_reason: 'I founded a startup in Hawaii and now work in Silicon Valley. I am happy to share my ' +
      'experiences with new grads.',
      image: 'lee.jpg',
    }, {
      name: 'Daniel Leuck',
      title: 'CEO, Ikayzo',
      location: 'Honolulu, HI',
      email: 'dan@ikayzo',
      linkedin: 'dleuck',
      mentor_reason: 'The UH ICS Department is an engine for the high tech industry in Hawaii. The better prepared ' +
      'we can make ICS graduates, the more success our industry will have and the more opportunities there will be ' +
      'for all.',
      image: 'leuck.jpg',
    }];
  },
});

Template.Student_MentorSpace_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.

});

Template.Student_MentorSpace_Page.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });

  this.$('.ui.dropdown')
    .dropdown()
  ;

  this.$('.ui.rating')
    .rating()
  ;
});
