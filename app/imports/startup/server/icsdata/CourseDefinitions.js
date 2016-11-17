/* eslint max-len: "off" */

/** @module CourseDefinitions */

/**
 * Provides an array containing standard ICS course definitions: name, slug, number, description, interests, syllabus,
 * and moreInformation (if defined).
 * Interests must be previously defined.
 */
export const courseDefinitions = [
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
    name: 'Digital Tools for the Information World',
    slug: 'ics101',
    number: 'ICS 101',
    creditHrs: 4,
    description: 'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
    interests: [],
    syllabus: ' ',
    moreInformation: ' ',
    prerequisites: [],
  },
  {
    name: 'Introduction to Computer Programming',
    slug: 'ics110',
    number: 'ICS 110',
    creditHrs: 3,
    description: 'Basic concepts needed to write computer programs. Simple program design and implementation using a specific programming language; (C) C; (D) through animations; (P) Python. Each alpha repeatable unlimited times, but credit earned one time only.',
    interests: [],
    syllabus: ' ',
    moreInformation: ' ',
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
    prerequisites: ['ics141'],
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
    prerequisites: ['ics241', 'ics211'],
  },
  {
    name: 'Software Engineering I',
    slug: 'ics314',
    number: 'ICS 314',
    description: 'Problem analysis and design, team-oriented development, quality assurance, configuration management, project planning.',
    interests: ['software-engineering', 'javascript', 'application-development', 'it-management'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS314.html',
    moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS314/',
    prerequisites: ['ics211', 'ics241'],
  },
  {
    name: 'Machine-Level and Systems Programming',
    slug: 'ics312',
    number: 'ICS 312',
    description: 'Machine organization, machine instructions, addressing modes, assembler language, subroutine linkage, linking to higher-level languages, interface to operating systems, introduction to assemblers, loaders and compilers.',
    interests: ['assembler', 'computer-architecture', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS311.html',
    moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS311/',
    prerequisites: ['ics212', 'ics314'],
  },
  {
    name: 'Programming Language Theory',
    slug: 'ics313',
    number: 'ICS 313',
    description: 'Syntax, semantics, control structures, variable binding and scopes, data and control abstractions. Programming in functional (LISP) and logic (Prolog) programming styles.',
    interests: ['lisp', 'prolog'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS313.html',
    prerequisites: ['ics212', 'ics311', 'ics314'],
  },
  {
    name: 'Data Storage and Retrieval',
    slug: 'ics321',
    number: 'ICS 321',
    description: 'Data storage devices, timing and capacity, programming for files, hashed and indexed files, introduction to relational database systems.',
    interests: ['databases', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS321.html',
    moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS321/',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Logic Design and Microprocessors',
    slug: 'ics331',
    number: 'ICS 331',
    creditHrs: 4,
    description: 'Basic machine architecture, microprocessors, bus organization, circuit elements, logic circuit analysis and design, microcomputer system design.',
    interests: ['computer-architecture', 'hardware', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS331.html',
    prerequisites: ['ics212', 'ics311', 'ics314'],
  },
  {
    name: 'Operating Systems',
    slug: 'ics332',
    number: 'ICS 332',
    description: 'Operating system concepts and structure, processes and threads, CPU scheduling, memory management, scheduling, file systems, inter-process communication, virtualization, popular operating systems.',
    interests: ['operating-systems', 'computer-architecture', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS332.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Network Design and Management',
    slug: 'ics351',
    number: 'ICS 351',
    description: 'Overview of the internet and its capabilities; introduction to HTTP, TCP/IP, ethernet, and wireless 802.11; routers, switches, and NAT; network and wireless security; practical experience in designing and implementing networks.',
    interests: ['networks', 'security', 'hardware', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS331.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Security and Trust I: Resource Protections',
    slug: 'ics355',
    number: 'ICS 355',
    description: 'Security and trust in computers, networks, and society. Security models. Access and authorization. Availability and Denial-of-Service. Trust processes and network interactions. ',
    interests: ['security'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS355.html',
    moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS355/',
    prerequisites: ['ics222', 'ics311', 'ics314'],
  },
  {
    name: 'Introduction to Artificial Intelligence Programming',
    slug: 'ics361',
    number: 'ICS 361',
    description: 'Introduction to the theory of Artificial Intelligence and the practical application of AI techniques in Functional (Common LISP and/or Scheme) and Logic (Prolog) programming languages. Students gain practical experience through programming assignments and projects.',
    interests: ['artificial-intelligence', 'lisp', 'prolog'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS361.html',
    prerequisites: ['ics212', 'ics311', 'ics314'],
  },
  {
    name: 'Computing Ethics for Lab Assistants',
    slug: 'ics390',
    number: 'ICS 390',
    description: 'A lecture/discussion/internship on ethical issues and instructional techniques for students assisting a laboratory section of ICS 101. The class uses multiple significant writing and oral presentation activities to help students learn course content.',
    interests: ['teaching', 'computer-ethics'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS390.html',
    prerequisites: ['ics101'],
  },
  {
    name: 'Software Engineering II',
    slug: 'ics414',
    number: 'ICS 414',
    description: 'Continuation of 314. Project management, quality, and productivity control, testing and validation, team management. Team-oriented software-implementation project.',
    interests: ['software-engineering', 'application-development', 'it-management'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS414.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Introduction to Programming for the Web',
    slug: 'ics415',
    number: 'ICS 415',
    description: 'Introduction to emerging technologies for construction of World Wide Web (WWW)-based software. Covers programming and scripting languages used for the creation of WWW sites and client-server programming. Students will complete a medium-sized software project that uses languages and concepts discussed in class.',
    interests: ['application-development', 'software-engineering'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS415.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'The Science, Psychology and Philosophy of Systems Design',
    slug: 'ics419',
    number: 'ICS 419',
    description: 'Scientific, psychological and philosophical bases of systems design, including a survey of human-factors and ergonomic standards; the nature of innovation and creativity as it relates to systems design.',
    interests: ['software-engineering', 'hci'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS419.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Database Systems',
    slug: 'ics421',
    number: 'ICS 421',
    description: 'Principles of database systems, data modeling, relational models, database design, query languages, query optimization, concurrency control data security.',
    interests: ['databases'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS421.html',
    prerequisites: ['ics321'],
  },
  {
    name: 'Data Processing',
    slug: 'ics422',
    number: 'ICS 422',
    description: 'Role of data processing in organizations, programming practices, ethics, sequential and indexed file processing, report writing, online transaction processing.',
    interests: ['databases'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS422.html',
    prerequisites: ['ics321'],
  },
  {
    name: 'Data Security and Cryptography I',
    slug: 'ics423',
    number: 'ICS 423',
    description: 'History of secret communication and confidential data storage. Elements of cryptography and cryptanalysis. Classical ciphers. Symmetric key cryptography. Public key cryptography. Data security in cyberspace.',
    interests: ['cryptography', 'security'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS423.html',
    prerequisites: ['ics355'],
  },
  {
    name: 'Application Frameworks',
    slug: 'ics424',
    number: 'ICS 424',
    description: 'Experience producing applications with at least two different applications frameworks.',
    interests: ['application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS424.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Computer Security and Ethics',
    slug: 'ics425',
    number: 'ICS 425',
    description: 'Theoretical results, security policy, encryption, key management, digital signatures, certificates, passwords. Ethics: privacy, computer crime, professional ethics. Effects of the computer revolution on society.',
    interests: ['security', 'computer-ethics', 'it-management'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS415.html',
    prerequisites: ['ics355'],
  },
  {
    name: 'Computer System Security',
    slug: 'ics426',
    number: 'ICS 426',
    description: ' Information flow, confinement, information assurance, malicious programs, vulnerability analysis, network security, writing secure programs.',
    interests: ['security', 'it-management'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS426.html',
    prerequisites: ['ics355'],
  },
  {
    name: 'Computer Architecture',
    slug: 'ics431',
    number: 'ICS 431',
    description: 'Memory management, control flow, interrupt mechanisms, multiprocessor systems, special-purpose devices.',
    interests: ['computer-architecture', 'hardware'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS431.html',
    prerequisites: ['ics331'],
  },
  {
    name: 'Concurrent and High-Performance Programming',
    slug: 'ics432',
    number: 'ICS 432',
    description: 'Principles of concurrent and high performance programming. Multi-threading in C and Java for shared-memory programming. Distributed memory programming with Java. Introduction to cluster computing.',
    interests: ['parallel-programming', 'hpc', 'c', 'java', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS432.html',
    prerequisites: ['ics311', 'ics314', 'ics212'],
  },
  {
    name: 'Machine Learning Fundamentals',
    slug: 'ics435',
    number: 'ICS 435',
    description: 'Introduction to machine learning concepts with a focus on relevant ideas from computational neuroscience. Information processing and learning in the nervous system. Neural networks. Supervised and unsupervised learning. Basics of statistical learning theory.',
    interests: ['machine-learning', 'data-science'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS435.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Theory of Computation',
    slug: 'ics441',
    number: 'ICS 441',
    description: 'Grammars, sequential machines, equivalence, minimalization, analysis and synthesis, regular expressions, computability, unsolvability, Godel\'s theorem, Turing machines.',
    interests: ['theory-of-computation', 'algorithms'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS441.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Analytical Models and Methods',
    slug: 'ics442',
    number: 'ICS 442',
    description: 'Applications of mathematical methods in computer science with emphasis on discrete mathematics, numerical computation, algebraic models, operations research.',
    interests: ['algorithms'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS442.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Parallel Algorithms',
    slug: 'ics443',
    number: 'ICS 443',
    description: 'Introduction to parallel models of computation and design and analysis of parallel algorithms.',
    interests: ['parallel-programming', 'algorithms', 'computer-architecture', 'data-science', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS443.html',
    prerequisites: ['ics311', 'ics314'],
  },

  {
    name: 'Data Networks',
    slug: 'ics451',
    number: 'ICS 451',
    description: ' Network analysis, architecture, digital signal analysis and design; circuit switching, packet switching, packet broadcasting; protocols and standards; local area networks; satellite networks; ALOHA channels; examples.',
    interests: ['networks', 'c'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS451.html',
    prerequisites: ['ics311', 'ics314', 'ics212'],
  },
  {
    name: 'Software Design for Robotics',
    slug: 'ics452',
    number: 'ICS 452',
    description: 'Sensors, actuators, signal processing, paradigms of robotic software design, introduction to machine learning, introduction to computer vision, and robot-to-human interaction.',
    interests: ['robotics', 'machine-learning', 'hardware', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS452.html',
    prerequisites: ['ics312', 'ics313'],
  },
  {
    name: 'Security and Trust II: Information Assurance',
    slug: 'ics455',
    number: 'ICS 455',
    description: 'Channel security. Trojan and noninterference. Basic concepts of cryptology. Cryptographic primitives. Protocols for authentication and key establishment.',
    interests: ['security', 'cryptography'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS455.html',
    prerequisites: ['ics355'],
  },
  {
    name: 'Artificial Intelligence',
    slug: 'ics461',
    number: 'ICS 461',
    description: 'Survey of artificial intelligence: natural language processing, vision and robotics, expert systems. Emphasis on fundamental concepts: search, planning, and problem solving, logic, knowledge representation.',
    interests: ['artificial-intelligence', 'algorithms', 'data-science', 'robotics'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS461.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Artificial Intelligence for Games',
    slug: 'ics462',
    number: 'ICS 462',
    description: 'Techniques to stimulate intelligence in video games: movement, pathfinding with A* search, decision/behavior trees, state machines, machine learning, tactics. Extend games with your own AI implementations; experience shootout contests for the best AI algorithm/implementation.',
    interests: ['algorithms', 'game-design', 'artificial-intelligence', 'machine-learning', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS462.html',
    prerequisites: ['ics311', 'ics314', 'ics212'],
  },
  {
    name: 'Human Computer Interaction I',
    slug: 'ics464',
    number: 'ICS 464',
    description: 'Application of concepts and methodologies of human factors, psychology and software engineering to address ergonomic, cognitive, and social factors in the design and evaluation of human-computer systems.',
    interests: ['software-engineering', 'hci'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS464.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Introduction to Hypermedia',
    slug: 'ics465',
    number: 'ICS 465',
    description: 'Basic issues of interactive access to information in various formats on computers. Available hardware and software: editing, integration, programming. Implementation of a sample information system.',
    interests: ['software-engineering', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS465.html',
    prerequisites: ['ics311', 'ics314'],
  },

  {
    name: 'Design for Mobile Devices',
    slug: 'ics466',
    number: 'ICS 466',
    description: 'Design issues, programming languages, operating systems and mark-up languages for internet-enabled mobile devices, such as cell phones and PDAs.',
    interests: ['mobile', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS424.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Cognitive Science',
    slug: 'ics469',
    number: 'ICS 469',
    description: 'Introduces basic concepts, central problems, and methods from cognitive science. Identifies contributions from disciplines such as cognitive psychology, linguistics, artificial intelligence, philosophy, and neuroscience.',
    interests: ['psychology', 'artificial-intelligence', 'cognitive-science', 'hci'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS469.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Probability, Statistics, and Queuing',
    slug: 'ics471',
    number: 'ICS 471',
    description: 'Introduction to probability, statistical inference, regression, Markov chains, queuing theory. Use of an interactive statistical graphics environment such as R.',
    interests: ['r', 'data-science', 'algorithms'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS471.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Introduction to Bioinformatics Sequences and Genomes Analysis',
    slug: 'ics475',
    number: 'ICS 475',
    description: 'Introduction to bioinformatics to computer sciences students by focusing on how computer science techniques can be used for the storage, analysis, prediction and simulation of biological sequences (DNA, RNA and proteins).',
    interests: ['bioinformatics', 'biology', 'algorithms', 'data-science'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS475.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Bioinformatics Algorithms and Tool Development',
    slug: 'ics476',
    number: 'ICS 476',
    description: 'Study of commonly used bioinformatic algorithms, with an emphasis on string, tree, and graph algorithms. Presentation of probabilistic and clustering methods. Implementation of the studied algorithms and design of applications.',
    interests: ['bioinformatics', 'biology', 'algorithms', 'data-science'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS476.html',
    prerequisites: ['ics475'],
  },
  {
    name: 'Introduction to Computer Graphics',
    slug: 'ics481',
    number: 'ICS 481',
    description: 'Fundamentals of computer graphics including graphics hardware, representation, manipulation, and display of two- and three-dimensional objects, use of commercial software.',
    interests: ['art', 'computer-graphics'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS481.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Computer Vision',
    slug: 'ics483',
    number: 'ICS 483',
    description: 'Introductory course in computer vision. Topics include image formation, image processing and filtering, edge detection, texture analysis and synthesis, binocular stereo, segmentation, tracking, object recognition and applications.',
    interests: ['computer-vision', 'algorithms'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS483.html',
    prerequisites: ['ics311', 'ics314', 'ics212'],
  },
  {
    name: 'Data Visualization',
    slug: 'ics484',
    number: 'ICS 484',
    description: 'Introduction to data visualization through practical techniques for turning data into images to produce insight. Topics include: information visualization, geospatial visualization, scientific visualization, social network visualization, and medical visualization.',
    interests: ['data-visualization', 'computer-graphics', 'data-science'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS484.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Video Game Design and Development',
    slug: 'ics485',
    number: 'ICS 485',
    description: 'Students will team design, build, and demonstrate video games or related interactive entertainment environments and applications. Topics will include emerging computer science techniques relevant to the development of these types of environments. ',
    interests: ['computer-graphics', 'art', 'game-design', 'application-development'],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS485.html',
    prerequisites: ['ics311', 'ics314'],
  },

  {
    name: 'Special Topics',
    slug: 'ics491',
    number: 'ICS 491',
    description: 'Reflects special interests of faculty. Oriented toward juniors and seniors. Repeatable one time for BS/CS students.',
    interests: [],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS485.html',
    prerequisites: ['ics311', 'ics314'],
  },

  {
    name: 'Special Topics in Security',
    slug: 'ics495',
    number: 'ICS 495',
    description: 'Special topics in security oriented toward juniors and seniors. Repeatable unlimited times.',
    interests: [],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS485.html',
    prerequisites: ['ics311', 'ics314'],
  },
  {
    name: 'Computer Project',
    slug: 'ics499',
    number: 'ICS 499',
    description: 'Individual or small-group projects in system design or application under faculty supervision.',
    interests: [],
    syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS485.html',
    prerequisites: ['ics311', 'ics314'],
  },
];
