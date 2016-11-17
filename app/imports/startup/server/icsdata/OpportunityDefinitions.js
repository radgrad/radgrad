/* eslint max-len: "off" */

/** @module OpportunityDefinitions */

/**
 * Provides an array containing OpportunityType definitions.
 */
export const opportunityTypeDefinitions = [
  { name: 'Research', slug: 'research', description: 'A research project related to computer science.' },
  {
    name: 'Club',
    slug: 'club',
    description: 'A student club or professional organization related to computer science.',
  },
  { name: 'Internship', slug: 'internship', description: 'An internship related to computer science.' },
  { name: 'Event', slug: 'event', description: 'An event related to computer science.' },
];

/**
 * Opportunities associated with the type 'Research'.
 */
const researchOpportunityDefinitions = [
  {
    name: 'Apps for high latency communication',
    slug: 'apps-for-high-latency-communication',
    description: 'HI-SEAS (Hawaii Space Exploration Analog and Simulation) simulates the conditions of long-duration human space exploration. Due to the distance between Earth and Mars, it takes 4-24 minutes for a signal to get from one to the other. However, most communication software is designed for much lower latency. For this project, you will design and implement a communications/social-media app that can handle high latency gracefully.',
    opportunityType: 'research',
    independentStudy: true,
    sponsor: 'kimbinsted',
    semesters: ['Fall-2016', 'Spring-2017'],
    interests: ['application-development'],
    moreInformation: 'http://hi-seas.org',
    ice: { i: 25, c: 0, e: 25 },
  },
  {
    name: 'Data analytics for solar energy',
    slug: 'data-analytics-for-solar-energy',
    description: 'Integrating renewable energy to the power grid requires grid operators to balance energy generation with consumption. This project investigates the use of various data mining techniques to forecast solar irradiance using a variety of time-series data sources. We are looking for motivated students interested in data integration, fusion, mining and visualization.',
    opportunityType: 'research',
    independentStudy: true,
    sponsor: 'lipyeowlim',
    semesters: ['Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['application-development', 'databases', 'algorithms', 'data-visualization', 'data-science', 'machine-learning'],
    moreInformation: 'http://www2.hawaii.edu/~lipyeow/',
    ice: { i: 25, c: 0, e: 25 },
  },
  {
    name: 'Open Power Quality',
    slug: 'open-power-quality',
    description: 'The Open Power Quality project is designing custom hardware and software for low-cost, residential monitoring and cloud-based analysis of power quality. By better understanding power quality, we hope to enable more renewable energy in Hawaii and world-wide. We are looking for students who are interested in exploring circuit design, power quality algorithms, time series analysis, and/or web-based user interfaces.',
    opportunityType: 'research',
    independentStudy: true,
    sponsor: 'philipjohnson',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['application-development', 'hardware', 'data-visualization', 'data-science'],
    moreInformation: 'http://openpowerquality.org',
    ice: { i: 25, c: 0, e: 25 },
  },
  {
    name: 'Security Enhancement of Commercial Airliner through Privileging Air Trafﬁc Controllers in Emergency',
    slug: 'security-enhancement-of-commercial-airliner',
    description: 'Malicious controllers can possibly manipulate a flight control system e.g. aircraft or drones. from various channels, e.g. autonomic control devices, remote cyber controller, or human operators. Thus, pilots could suicide the aircraft, the auto-pilot might be infected by malware, and air traffic controllers can mishandle the drone. To better mitigate the potential risks, we hope to propose theoretical framework model in physical, human and cyber triad, a more secure air traffic control system, and a more safe task allocation mechanism. Students who are interested in aviation, risk control, and human-machine interface are highly encouraged to apply. ',
    opportunityType: 'research',
    independentStudy: true,
    sponsor: 'depengli',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['application-development', 'security', 'hci'],
    moreInformation: 'http://www2.hawaii.edu/~depengli/index.html',
    ice: { i: 25, c: 0, e: 25 },
  },
  {
    name: 'AllNet: networking among mobile devices',
    slug: 'allnet',
    description: 'My cellphone has a radio that could easily communicate with the radio in your cellphone. However, currently they do not, even when they are smartphones with wifi (802.11) capability. The AllNet project aims to allow personal devices to communicate directly with each other. We are looking for students who want to learn how to get different devices, both computers and cellphones/mobiles, to talk directly with each other. We are also interested in students who think they can adapt the current code to run as an app on their favorite mobile device. ',
    opportunityType: 'research',
    independentStudy: true,
    sponsor: 'edobiagioni',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['application-development', 'networks', 'mobile'],
    moreInformation: 'http://alnt.org/',
    ice: { i: 25, c: 0, e: 25 },
  },
];

/**
 * Opportunities associated with the type 'Club'.
 */
const clubOpportunityDefinitions = [
  {
    name: 'HI Capacity',
    slug: 'hicapacity',
    description: 'HI Capacity is a "makerspace" or "hackerspace": a community-operated physical place where people can meet and work on their projects. HI Capacity members are interested in hardware, software, art and the synergies between them. HI Capacity hosts social events, technical presentations, and soft skill workshops to support a vibrant technology sector in Hawaii while also trying to enrich other sectors with our skills in technology. We cater to all skill levels from hobbyist to student to senior professional.',
    opportunityType: 'club',
    sponsor: 'philipjohnson',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['hardware', 'entrepreneurship', 'application-development'],
    moreInformation: 'https://hicapacity.org/',
    ice: { i: 10, c: 0, e: 10 },
  },
  {
    name: 'ACM Manoa',
    slug: 'acm-manoa',
    description: 'The Association for Computing Machinery at Manoa is UH Manoa’s student chapter of the Association for Computing Machinery. We are a Registered Independent Organization (RIO) focused on providing opportunities and resources for our members’ personal and professional advancement.  ACM Manoa has 3 pillars - social, professional, and technical. We hold social activities for our members to have fun as well as develop and strengthen their interpersonal relationships. We strive to connect our members to professionals in the industry, abroad and within the Honolulu community. We are largely comprised of aspiring professionals in the computing industry; accordingly, members in ACM Manoa are encouraged to join and create Special Interest Groups (SIG) and Playgrounds where they can collaborate on interesting projects.',
    opportunityType: 'club',
    sponsor: 'philipjohnson',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017'],
    interests: ['hardware', 'entrepreneurship', 'application-development'],
    moreInformation: 'http://acmanoa.github.io/',
    ice: { i: 10, c: 0, e: 10 },
  },
];

/**
 * Opportunities associated with the type 'Event'.
 */
const eventOpportunityDefinitions = [
  {
    name: 'Shidler Business Plan Competition',
    slug: 'shidler-bpc',
    description: 'The annual Shidler Business Plan competition is an intense and unique semester-long learning opportunity for UH students who aspire to pursue a business venture. The competition provides mentorship, training and resources. Winners walk away with a wealth of business savvy and substantial cash prizes. ',
    opportunityType: 'event',
    sponsor: 'philipjohnson',
    semesters: ['Fall-2015', 'Spring-2016', 'Fall-2016', 'Spring-2017'],
    interests: ['entrepreneurship'],
    moreInformation: 'http://pace.shidler.hawaii.edu/bpc',
    ice: { i: 10, c: 0, e: 25 },
  },
  {
    name: 'Wetware Wednesday',
    slug: 'wetware-wednesday',
    description: 'WetWare Wednesday is dedicated to software developers in Hawaii who are interested in meeting monthly in a casual and friendly environment to share ideas, collaborate and spark new opportunities. Founded by HTDC and Blue Planet Software, the goal of WetWare Wednesday is to bring software developers, students and educators together to connect, network, discuss projects, review products, and collaborate in an effort to further the software development community. Venues and sponsors change monthly.',
    opportunityType: 'event',
    sponsor: 'philipjohnson',
    semesters: ['Fall-2015', 'Spring-2016', 'Summer-2016', 'Fall-2016', 'Spring-2017', 'Summer-2017', 'Fall-2017', 'Spring-2018', 'Summer-2018', 'Fall-2018', 'Spring-2019', 'Summer-2019'],
    interests: ['entrepreneurship'],
    moreInformation: 'http://htdc.org/wetwarewed/',
    ice: { i: 10, c: 0, e: 10 },
  },
];

export const opportunityInstances = [
  { semester: 'Fall-2015',
    opportunity: 'wetware-wednesday',
    verified: false,
    student: 'abi',
  },
  { semester: 'Spring-2016',
    opportunity: 'wetware-wednesday',
    verified: false,
    student: 'abi',
  },
  { semester: 'Fall-2016',
    opportunity: 'open-power-quality',
    verified: false,
    student: 'abi',
  },
  { semester: 'Spring-2017',
    opportunity: 'open-power-quality',
    verified: false,
    student: 'abi',
  },
  { semester: 'Summer-2017',
    opportunity: 'open-power-quality',
    verified: false,
    student: 'abi',
  },
];

export const opportunityDefinitions = researchOpportunityDefinitions.concat(clubOpportunityDefinitions, eventOpportunityDefinitions);

