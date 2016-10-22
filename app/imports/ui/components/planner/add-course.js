import { Template } from 'meteor/templating';

Template.Add_Course.helpers({
  courseArgs(course) {
    return {
      course,
    };
  },
  courses() {
    return [
      {
        name: 'Non Computer Science Course',
        slug: 'other',
        number: 'other',
        creditHrs: 3,
        description: 'The course used to represent all non-CS courses.',
        interests: [],
        syllabus: '',
        moreInformation: '',
        prerequisites: [],
      },
      {
        name: 'Introduction to Computer Science I',
        slug: 'ics111',
        number: 'ICS 111',
        creditHrs: 4,
        description: 'Overview of computer science, including Java programming, control structures, subroutines, objects and classes, GUI programming, arrays, and recursion.',
        interests: ['java'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS111.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS111/',
        prerequisites: [],
      },
      {
        name: 'Discrete Mathematics for Computer Science I',
        slug: 'ics141',
        number: 'ICS 141',
        description: 'Introduction to propositional and predicate logic, sets, functions, linear algebra, algorithms, mathematical reasoning, recursion, counting techniques, and probability theory.',
        interests: ['algorithms'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS141.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS141/',
        prerequisites: [],
      },
      {
        name: 'Introduction to Computer Science II',
        slug: 'ics211',
        number: 'ICS 211',
        creditHrs: 4,
        description: 'Object-oriented programming, algorithms and their complexity, introduction to software engineering, lists, stacks, queues, trees hash tables, and searching and sorting algorithms.',
        interests: ['algorithms', 'software-engineering', 'java'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS211.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS211/',
        prerequisites: ['ics111'],
      },
      {
        name: 'Program Structure',
        slug: 'ics212',
        number: 'ICS 212',
        description: 'Program organization paradigms, programming environments, implementation of a module from specifications, the C and C++ programming languages.',
        interests: ['c', 'cplusplus', 'application-development'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS212.html',
        prerequisites: ['ics211'],
      },
      {
        name: 'Introduction to Scripting',
        slug: 'ics215',
        number: 'ICS 215',
        description: 'Introduction to scripting languages for the integration of applications and systems. Scripting in operating systems, web pages, server-side application integration, regular expressions, event handling, input validation, selection, repetition, parameter passing, Perl, JavaScript, and PHP.',
        interests: ['perl', 'javascript', 'ruby', 'application-development'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS215/',
        prerequisites: ['ics211'],
      },
      {
        name: 'Basic Concepts of Computer Science',
        slug: 'ics222',
        number: 'ICS 222',
        description: 'What is computer science about? What is the difference between computers and other machines? What are the limits of computation? Are there computers that are not machines? Understand the basic issues of computability, complexity, and network effects, and learn to apply them in the practice of computation.',
        interests: ['theory-of-computation'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS222.html',
        prerequisites: [],
      },
      {
        name: 'Discrete Mathematics for Computer Science II',
        slug: 'ics241',
        number: 'ICS 241',
        description: 'Program correctness, recurrence relations and their solutions, divide and conquer relations, relations and their properties, graph theory, trees and their applications, Boolean algebra, introduction to formal languages and automata theory.',
        interests: ['algorithms'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS241.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS241/',
        prerequisites: ['ics141'],
      },
      {
        name: 'Algorithms',
        slug: 'ics311',
        number: 'ICS 311',
        creditHrs: 4,
        description: 'Design and correctness of algorithms, including divide-and-conquer, greedy and dynamic programming methods. Complexity analyses using recurrence relations, probabilistic methods, and NP-completeness. Applications to order statistics, disjoint sets, B-trees and balanced trees, graphs, network flows, and string matching.',
        interests: ['algorithms', 'data-science'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS311.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS311/',
        prerequisites: ['ics141', 'ics211'],
      },
      {
        name: 'Machine-Level and Systems Programming',
        slug: 'ics312',
        number: 'ICS 312',
        description: 'Machine organization, machine instructions, addressing modes, assembler language, subroutine linkage, linking to higher-level languages, interface to operating systems, introduction to assemblers, loaders and compilers.',
        interests: ['assembler', 'computer-architecture', 'application-development'],
        syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS311.html',
        moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS311/',
        prerequisites: ['ics212'],
      },
    ];
  },
});

Template.Add_Course.events({
  // add your events here
});

Template.Add_Course.onCreated(function () {
  // add your statement here
});

Template.Add_Course.onRendered(function () {

});

Template.Add_Course.onDestroyed(function () {
  // add your statement here
});

