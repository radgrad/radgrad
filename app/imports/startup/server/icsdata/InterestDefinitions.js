/* eslint max-len: "off" */

/** @module InterestDefinitions */

/**
 * Provides an array containing InterestType definitions.
 */
export const interestTypeDefinitions = [
  {
    name: 'CS Disciplines',
    slug: 'cs-disciplines',
    description: 'Computer science and engineering areas of interest, not including languages, tools, technologies.',
  },
  {
    name: 'Non-CS Disciplines',
    slug: 'non-cs-disciplines',
    description: 'Areas of interest apart from computer science and engineering.',
  },
  {
    name: 'technologies',
    slug: 'technologies',
    description: 'Computer science and engineering languages, tools, and technologies',
  },
];

/**
 * Interests associated with the type 'CS-Disciplines'.
 */
const csDisciplineDefinitions = [
  {
    name: 'Algorithms',
    slug: 'algorithms',
    description: 'Simply put, an algorithm is a self-contained step-by-step set of operations to be performed. More specifically, an algorithm is an effective method that can be expressed within a finite amount of space and time and in a well-defined formal language for calculating a function. Starting from an initial state and initial input (perhaps empty), the instructions describe a computation that, when executed, proceeds through a finite number of well-defined successive states, eventually producing "output" and terminating at a final ending state. The transition from one state to the next is not necessarily deterministic; some algorithms, known as randomized algorithms, incorporate random input.',
    moreInformation: 'https://en.wikipedia.org/wiki/Algorithm',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Application Development',
    slug: 'application-development',
    description: 'Application development is the use of tools, technologies, procedures, and domain knowledge to create and maintain useful software and/or hardware systems.',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'The use of hardware and software to create a flexible rational agent that perceives its environment and takes actions that maximize its chance of success at an arbitrary goal. Colloquially, the term "artificial intelligence" is likely to be applied when a machine uses cutting-edge techniques to competently perform or mimic functions that we intuitively associate with human minds, such as "learning" and "problem solving".',
    moreInformation: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Bioinformatics',
    slug: 'bioinformatics',
    description: 'Bioinformatics is an interdisciplinary field combining computer science, statistics, mathematics, and engineering that develops methods and software tools for understanding biological data. Common uses of bioinformatics include the identification of candidate genes and nucleotides (SNPs). Often, such identification is made with the aim of better understanding the genetic basis of disease, unique adaptations, desirable properties (esp. in agricultural species), or differences between populations.',
    moreInformation: 'https://en.wikipedia.org/wiki/Bioinformatics',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Computer Architecture',
    slug: 'computer-architecture',
    description: 'Computer architecture describes the functionality, organization, and implementation of computer systems. Some architectures define the capabilities and programming model of a computer but not a particular implementation. Others include instruction set design, micro-architecture design, logic design, and implementation. Computer architecture can focus on hardware or can include both hardware and software.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_architecture',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Computer Graphics',
    slug: 'computer-graphics',
    description: 'Computer graphics are pictures and movies created using computers - usually referring to image data created by a computer specifically with help from specialized graphical hardware and software. Important topics in computer graphics include user interface design, sprite graphics, vector graphics, 3D modeling, shaders, GPU design, and computer vision. The overall methodology depends heavily on the sciences of geometry, optics, and physics. Computer graphic development has had a significant impact on many types of media and has revolutionized animation, movies, advertising, video games, and graphic design generally.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_graphics',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Computer Vision',
    slug: 'computer-vision',
    description: 'Computer vision is a field that includes methods for acquiring, processing, analyzing, and understanding images and, in general, high-dimensional data from the real world in order to produce numerical or symbolic information that can be used to take action. A common theme is to duplicate the abilities of human vision by electronically perceiving and understanding an image. Subdomains of computer vision include scene reconstruction, event detection, video tracking, object recognition, object pose estimation, learning, indexing, motion estimation, and image restoration.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_vision',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Cognitive Science',
    slug: 'cognitive-science',
    description: 'Cognitive science is the interdisciplinary scientific study of the mind and its processes. It examines what cognition is, what it does and how it works. It includes research on intelligence and behaviour, especially focusing on how information is represented, processed, and transformed (in faculties such as perception, language, memory, attention, reasoning, and emotion) within nervous systems (humans or other animals) and machines (e.g. computers). Cognitive science includes multiple research disciplines, including psychology, artificial intelligence, philosophy, neuroscience, linguistics, and anthropology.',
    moreInformation: 'https://en.wikipedia.org/wiki/Cognitive_science',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Cryptography',
    slug: 'cryptography',
    description: 'Cryptography is the study of techniques for secure communication: constructing and analyzing protocols that prevent third parties or the public from reading private messages. Data confidentiality, data integrity, authentication, and non-repudiation are central to modern cryptography. Modern cryptography exists at the intersection of mathematics, computer science, and electrical engineering. Applications of cryptography include ATM cards, computer passwords, and electronic commerce.',
    moreInformation: 'https://en.wikipedia.org/wiki/Cryptography',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Databases',
    slug: 'databases',
    description: 'A database is an organized collection of data. It includes schemas, tables, queries, reports, views and other objects. The data are typically organized to model aspects of reality in a way that supports processes requiring information, such as modelling the availability of rooms in hotels in a way that supports finding a hotel with vacancies. Access to these data is usually provided by a "database management system" (DBMS) consisting of an integrated set of computer software that allows users to interact with one or more databases and provides access to all of the data contained in the database (although restrictions may exist that limit access to particular data). The DBMS provides various functions that allow entry, storage and retrieval of large quantities of information and provides ways to manage how that information is organized.',
    moreInformation: 'https://en.wikipedia.org/wiki/Database',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Data Visualization',
    slug: 'data-visualization',
    description: 'Data visualization is both an art and a science. A primary goal of data visualization is to communicate information clearly and efficiently via statistical graphics, plots and information graphics. Numerical data may be encoded using dots, lines, or bars, to visually communicate a quantitative message. Effective visualization helps users analyze and reason about data and evidence. It makes complex data more accessible, understandable and usable.',
    moreInformation: 'https://en.wikipedia.org/wiki/Data_visualization',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    description: 'Data science is an interdisciplinary field about processes and systems to extract knowledge or insights from data in various forms, either structured or unstructured. Data science employs techniques and theories drawn from many fields within the broad areas of mathematics, statistics, information science, and computer science, including signal processing, probability models, machine learning, statistical learning, data mining, database, data engineering, pattern recognition and learning, visualization, predictive analytics, uncertainty modeling, data warehousing, data compression, computer programming, artificial intelligence, and high performance computing. Methods that scale to big data are of particular interest in data science. Data science affects many domains, including machine translation, speech recognition, robotics, search engines, digital economy, but also the biological sciences, medical informatics, health care, social sciences and the humanities.',
    moreInformation: 'https://en.wikipedia.org/wiki/Data_science',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Computer Ethics',
    slug: 'computer-ethics',
    description: 'Computer Ethics is a part of practical philosophy which concerns with how computing professionals should make decisions regarding professional and social conduct. Computer ethics can inform issues such as copyright infringement, privacy, piracy, and social informatics.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_ethics',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    description: 'Entrepreneurship is the process of designing, launching and running a new business, such as a startup company offering a product, process or service. It requires the capacity and willingness to develop, organize, and manage a business venture along with any of its risks in order to make a profit. Entrepreneurs tend to be good at perceiving new business opportunities and they often exhibit positive biases in their perception (i.e., a bias towards finding new possibilities and seeing unmet market needs) and a pro-risk-taking attitude that makes them more likely to exploit the opportunity.',
    moreInformation: 'https://en.wikipedia.org/wiki/Entrepreneurship',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Game design',
    slug: 'game-design',
    description: 'Game design is the art of applying design and aesthetics to create a game to facilitate interaction between players for entertainment or for medical, educational, or experimental purposes. Game design creates goals, rules, and challenges to produce desirable interactions among its participants and, possibly, spectators.',
    moreInformation: 'https://en.wikipedia.org/wiki/Game_design',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Graduate School',
    slug: 'graduate-school',
    description: 'Graduate school in computer science leads to an M.S. or Ph.D degree. An M.S. is typically a technical degree that gives you more advanced skills and thus makes available more interesting (and more highly paid) job opportunities. A Ph.D. is a research degree, which opens up entirely different kinds of opportunities (such as University Professors in academia and Research Group managers in industry).',
    moreInformation: 'https://www.cs.princeton.edu/academics/ugradpgm/gsg',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Hardware',
    slug: 'hardware',
    description: 'Computer hardware is the physical parts or components of a computer, such as the monitor, mouse, keyboard, computer data storage, hard disk drive (HDD), graphic cards, sound cards, memory (RAM), motherboard, and so on, all of which are tangible physical objects. By contrast, software is instructions that can be stored and run by hardware.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_hardware',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Human-Computer Interaction',
    slug: 'hci',
    description: 'Researchers in the field of HCI both observe the ways in which humans interact with computers and design technologies that let humans interact with computers in novel ways. Human-computer interaction is situated at the intersection of computer science, behavioral sciences, design, and media studies.  ',
    moreInformation: 'https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction',
    interestType: 'cs-disciplines',
  },
  {
    name: 'High Performance Computing',
    slug: 'hpc',
    description: 'High Performance Computing concerns the hardware and software capabilities required for effective use of "supercomputers". HPC techniques are needed for computationally intensive tasks in various fields, including quantum mechanics, weather forecasting, climate research, oil and gas exploration, molecular modeling (computing the structures and properties of chemical compounds, biological macromolecules, polymers, and crystals), and physical simulations (such as simulations of the early moments of the universe, airplane and spacecraft aerodynamics, the detonation of nuclear weapons, and nuclear fusion). Throughout their history, they have been essential in the field of cryptanalysis.  ',
    moreInformation: 'https://en.wikipedia.org/wiki/Supercomputer',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence. Machine learning explores the study and construction of algorithms that can learn from and make predictions on data. Such algorithms operate by building a model from example inputs in order to make data-driven predictions or decisions expressed as outputs. Machine learning is employed in a range of computing tasks where designing and programming explicit algorithms is infeasible. Example applications include spam filtering, optical character recognition (OCR), search engines, and computer vision.',
    moreInformation: 'https://en.wikipedia.org/wiki/Machine_learning',
    interestType: 'cs-disciplines',
  },
  {
    name: 'IT Management',
    slug: 'it-management',
    description: 'IT management is the discipline whereby all of the information technology resources of a firm are managed in accordance with its needs and priorities. These resources may include tangible investments like computer hardware, software, data, networks and data centre facilities, as well as the staff who are hired to maintain them. Managing this responsibility within a company entails many of the basic management functions, like budgeting, staffing, change management, and organizing and controlling, along with other aspects that are unique to technology, like software design, network planning, tech support etc.',
    moreInformation: 'https://en.wikipedia.org/wiki/Information_technology_management',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Mobile Computing',
    slug: 'mobile',
    description: 'Mobile computing is human–computer interaction by which a computer is expected to be transported during normal usage, which allows for transmission of data, voice and video. Mobile computing involves mobile communication, mobile hardware, and mobile software. Communication issues include ad hoc networks and infrastructure networks as well as communication properties, protocols, data formats and concrete technologies. Hardware includes mobile devices or device components. Mobile software deals with the characteristics and requirements of mobile applications.',
    moreInformation: 'https://en.wikipedia.org/wiki/Mobile_computing',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Networks',
    slug: 'networks',
    description: 'A computer network or data network is a telecommunications network which allows computers to exchange data. In computer networks, networked computing devices exchange data with each other using a data link. The connections between nodes are established using either cable media or wireless media. The best-known computer network is the Internet.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_network',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Operating Systems',
    slug: 'operating-systems',
    description: 'An operating system (OS) is system software that manages computer hardware and software resources and provides common services for computer programs. Examples of popular desktop operating systems include Apple OS X, Linux and its variants, and Microsoft Windows. So-called mobile operating systems include Android and iOS. Other classes of operating systems, such as real-time (RTOS), also exist.',
    moreInformation: 'https://en.wikipedia.org/wiki/Operating_system',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Parallel Programming',
    slug: 'parallel-programming',
    description: 'Parallel programming refers to a type of computation in which many calculations are carried out simultaneously, operating on the principle that large problems can often be divided into smaller ones, which are then solved at the same time. In some cases parallelism is transparent to the programmer, such as in bit-level or instruction-level parallelism, but explicitly parallel algorithms, particularly those that use concurrency, are more difficult to write than sequential ones, because concurrency introduces several new classes of potential software bugs, of which race conditions are the most common. Communication and synchronization between the different subtasks are typically some of the greatest obstacles to getting good parallel program performance. ',
    moreInformation: 'https://en.wikipedia.org/wiki/Parallel_computing',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Robotics',
    slug: 'robotics',
    description: 'Robotics is the branch of mechanical engineering, electrical engineering and computer science that deals with the design, construction, operation, and application of robots, as well as computer systems for their control, sensory feedback, and information processing. Robots can take the place of humans in dangerous environments or manufacturing processes, or resemble humans in appearance, behaviour, and or cognition. Many robots are inspired by nature contributing to the field of bio-inspired robotics.',
    moreInformation: 'https://en.wikipedia.org/wiki/Robotics',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Computer security, also known as cybersecurity or IT security, is the protection of information systems from theft or damage to the hardware, the software, and to the information on them, as well as from disruption or misdirection of the services they provide. It includes controlling physical access to the hardware, as well as protecting against harm that may come via network access, data and code injection, and due to malpractice by operators, whether intentional, accidental, or due to them being tricked into deviating from secure procedures.',
    moreInformation: 'https://en.wikipedia.org/wiki/Computer_security',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'The systematic application of scientific and technological knowledge, methods, and experience to the design, implementation, testing, and documentation of software. The discipline of software engineering was created to address poor quality of software, get projects exceeding time and budget under control, and ensure that software is built systematically, rigorously, measurably, on time, on budget, and within specification. In 2012, Software Engineering was ranked as the best job in the United States by CareerCast.com.',
    moreInformation: 'https://en.wikipedia.org/wiki/Software_engineering',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Teaching',
    slug: 'teaching',
    description: 'Teaching is the process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits. Educational methods include storytelling, discussion, teaching, training, and directed research. ',
    moreInformation: 'https://en.wikipedia.org/wiki/Education',
    interestType: 'cs-disciplines',
  },
  {
    name: 'Theory of computation',
    slug: 'theory-of-computation',
    description: 'Theory of computation deals with how efficiently problems can be solved on a model of computation, using an algorithm. The field is divided into three major branches: automata theory and language, computability theory, and computational complexity theory, which are linked by the question: "What are the fundamental capabilities and limitations of computers?".',
    moreInformation: 'https://en.wikipedia.org/wiki/Theory_of_computation',
    interestType: 'cs-disciplines',
  },
];

/**
 * Interest definitions not associated with computer science.
 */
const nonCsDisciplineDefinitions = [
  {
    name: 'Art',
    slug: 'art',
    description: 'A diverse range of human activities in creating visual, auditory or performing artifacts artworks, expressing the author\'s imaginative or technical skill, intended to be appreciated for their beauty or emotional power.',
    moreInformation: 'https://en.wikipedia.org/wiki/Art',
    interestType: 'non-cs-disciplines',
  },
  {
    name: 'Biology',
    slug: 'biology',
    description: 'A natural science concerned with the study of life and living organisms, including their structure, function, growth, evolution, distribution, and taxonomy.',
    moreInformation: 'https://en.wikipedia.org/wiki/Biology',
    interestType: 'non-cs-disciplines',
  },
  {
    name: 'Psychology',
    slug: 'psychology',
    description: 'The scientific study of the human mind and its functions, especially those affecting behavior in a given context.',
    moreInformation: 'https://en.wikipedia.org/wiki/Psychology',
    interestType: 'non-cs-disciplines',
  },
];

/**
 * Interests associated with a specific language, tool, or technology in computer science.
 */
const technologyDefinitions = [
  {
    name: 'Android',
    slug: 'android',
    description: 'Android is a mobile operating system (OS) currently developed by Google, based on the Linux kernel and designed primarily for touchscreen mobile devices such as smartphones and tablets. In addition to touchscreen devices, Google has further developed Android TV for televisions, Android Auto for cars, and Android Wear for wrist watches, each with a specialized user interface. Variants of Android are also used on notebooks, game consoles, digital cameras, and other electronics. Android has the largest installed base of all operating systems of any kind. Android has been the best selling OS on tablets since 2013, and on smartphones it is dominant by any metric.',
    interestType: 'technologies',
    moreInformation: 'https://www.android.com/',
  },
  {
    name: 'Assembler',
    slug: 'assembler',
    description: 'An assembler (or assembly) language is a low-level programming language for a computer in which there is a direct correspondence between the language and the architecture\'s machine code instructions. Each assembly language is specific to a particular computer architecture, in contrast to most high-level programming languages, which are generally portable across multiple architectures, but require interpreting or compiling. Assembly language may also be called symbolic machine code. Assembly language is converted into executable machine code by a utility program referred to as an assembler. The conversion process is referred to as assembly, or assembling the source code. ',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/Assembly_language',
  },
  {
    name: 'C',
    slug: 'c',
    description: 'C is a general-purpose, imperative computer programming language, supporting structured programming, lexical variable scope and recursion, and includes a static type system that prevents many unintended operations. By design, C provides constructs that map efficiently to typical machine instructions, and therefore it has found lasting use in applications that had formerly been coded in assembly language. Despite its low-level capabilities, the language was designed to encourage cross-platform programming. A standards-compliant and portably written C program can be compiled for a very wide variety of computer platforms and operating systems with few changes to its source code. The language has become available on a very wide range of platforms, from embedded microcontrollers to supercomputers.',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/C_(programming_language)',
  },
  {
    name: 'C++',
    slug: 'cplusplus',
    description: 'C++ is a general-purpose programming language. It has imperative, object-oriented and generic programming features, while also providing facilities for low-level memory manipulation. It was designed with a bias toward system programming and embedded, resource-constrained and large systems, with performance, efficiency and flexibility of use as its design highlights. Many other programming languages have been influenced by C++, including C#, Java, and newer versions of C (after 1998).',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/C_(programming_language)',
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'Java is a general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible. It is intended to let application developers "write once, run anywhere", meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. Java applications are typically compiled to bytecode that can run on any Java virtual machine regardless of computer architecture. As of 2016, Java is one of the most popular programming languages in use, particularly for client-server web applications, with a reported 9 million developers.',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/Java_(programming_language)',
  },
  {
    name: 'Javascript',
    slug: 'javascript',
    description: 'JavaScript is a high-level, dynamic, untyped, and interpreted programming language. Despite some syntactic similarities, JavaScript and Java are otherwise unrelated and have very different semantics. Alongside HTML and CSS, Javascript is one of the three core technologies of World Wide Web content production; the majority of websites employ it and it is supported by all modern Web browsers without plug-ins. JavaScript is prototype-based with first-class functions, making it a multi-paradigm language, supporting object-oriented, imperative, and functional programming styles. It has an API for working with text, arrays, dates and regular expressions, but does not include any I/O, such as networking, storage, or graphics facilities, relying for these upon the host environment in which it is embedded.',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/JavaScript',
  },
  {
    name: 'Lisp',
    slug: 'lisp',
    description: 'Lisp is a family of computer programming languages with a long history and a distinctive, fully parenthesized prefix notation. Originally specified in 1958, Lisp is the second-oldest high-level programming language in widespread use today; only Fortran is older (by one year). Lisp was originally created as a practical mathematical notation for computer programs, influenced by the notation of Alonzo Church\'s lambda calculus. It quickly became the favored programming language for artificial intelligence (AI) research. As one of the earliest programming languages, Lisp pioneered many ideas in computer science, including tree data structures, automatic storage management, dynamic typing, conditionals, higher-order functions, recursion, and the self-hosting compiler.',
    interestType: 'technologies',
    moreInformation: 'https://en.wikipedia.org/wiki/Lisp_(programming_language)',
  },
  {
    name: 'Linux',
    slug: 'linux',
    description: 'A Unix-like and mostly POSIX-compliant computer operating system (OS) assembled under the model of free and open-source software development and distribution. Linux was originally developed as a free operating system for personal computers based on the Intel x86 architecture, but has since been ported to more computer hardware platforms than any other operating system. Because of the dominance of Android on smartphones, Linux has the largest installed base of all general-purpose operating systems.',
    moreInformation: 'https://en.wikipedia.org/wiki/Linux',
    interestType: 'technologies',
  },
  {
    name: 'Perl',
    slug: 'perl',
    description: 'Perl is a family of high-level, general-purpose, interpreted, dynamic programming languages. Perl 5 is used for graphics programming, system administration, network programming, finance, bioinformatics, and other applications. It has been nicknamed "the Swiss Army chainsaw of scripting languages" because of its flexibility and power, and possibly also because of its "ugliness". In 1998, it was also referred to as the "duct tape that holds the Internet together", in reference to both its ubiquitous use as a glue language and its perceived inelegance.',
    moreInformation: 'https://www.perl.org/',
    interestType: 'technologies',
  },
  {
    name: 'Prolog',
    slug: 'prolog',
    description: 'Prolog is a general-purpose logic programming language associated with artificial intelligence and computational linguistics. Prolog has its roots in first-order logic, a formal logic, and unlike many other programming languages, Prolog is declarative: the program logic is expressed in terms of relations, represented as facts and rules. The language has been used for theorem proving, expert systems, as well as its original intended field of use, natural language processing.',
    moreInformation: 'https://en.wikipedia.org/wiki/Prolog',
    interestType: 'technologies',
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python is a widely used high-level, general-purpose, interpreted, dynamic programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java. Python supports multiple programming paradigms, including object-oriented, imperative and functional programming or procedural styles. It features a dynamic type system and automatic memory management and has a large and comprehensive standard library.',
    moreInformation: 'https://www.python.org/',
    interestType: 'technologies',
  },
  {
    name: 'R',
    slug: 'r',
    description: 'R is a programming language and software environment that is widely used among statisticians and data miners for developing statistical software and data analysis. R and its libraries implement a wide variety of statistical and graphical techniques, including linear and nonlinear modeling, classical statistical tests, time-series analysis, classification, clustering, and others.',
    moreInformation: 'https://en.wikipedia.org/wiki/R_(programming_language)',
    interestType: 'technologies',
  },
  {
    name: 'Ruby',
    slug: 'ruby',
    description: 'Ruby is a dynamic, reflective, object-oriented, general-purpose programming language. Ruby was influenced by Perl, Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, including functional, object-oriented, and imperative. It also has a dynamic type system and automatic memory management. Ruby\'s creator, Yukihiro Matsumoto, has stated, "I hope to see Ruby help every programmer in the world to be productive, and to enjoy programming, and to be happy. That is the primary purpose of Ruby language."',
    moreInformation: 'http://www.ruby-lang.org/en/',
    interestType: 'technologies',
  },
  {
    name: 'SQL',
    slug: 'sql',
    description: 'SQL (Structured Query Language) is a special-purpose programming language designed for managing data held in a relational database management system , or for stream processing in a relational data stream management system. Originally based upon relational algebra and tuple relational calculus, SQL consists of a data definition language, data manipulation language, and a data control language. The scope of SQL includes data insert, query, update and delete, schema creation and modification, and data access control.',
    moreInformation: 'https://en.wikipedia.org/wiki/SQL',
    interestType: 'technologies',
  },
];

/**
 * All interests defined in this file.
 */
export const interestDefinitions = csDisciplineDefinitions.concat(nonCsDisciplineDefinitions, technologyDefinitions);

