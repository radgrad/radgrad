import { Template } from 'meteor/templating';

Template.Add_Opportunity.helpers({
  opportunityArgs(opportunity) {
    return {
      opportunity,
    };
  },
  opportunities() {
    return [
      {
        name: 'Apps for high latency communication',
        slug: 'apps-for-high-latency-communication',
        description: 'HI-SEAS (Hawaii Space Exploration Analog and Simulation) simulates the conditions of long-duration human space exploration. Due to the distance between Earth and Mars, it takes 4-24 minutes for a signal to get from one to the other. However, most communication software is designed for much lower latency. For this project, you will design and implement a communications/social-media app that can handle high latency gracefully.',
        opportunityType: 'research',
        independentStudy: true,
        sponsor: 'kimbinsted',
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
        interests: ['application-development', 'hardware', 'data-visualization', 'data-science'],
        moreInformation: 'http://openpowerquality.org',
        ice: { i: 25, c: 0, e: 25 },
      },
      {
        name: 'HI Capacity',
        slug: 'hicapacity',
        description: 'HI Capacity is a "makerspace" or "hackerspace": a community-operated physical place where people can meet and work on their projects. HI Capacity members are interested in hardware, software, art and the synergies between them. HI Capacity hosts social events, technical presentations, and soft skill workshops to support a vibrant technology sector in Hawaii while also trying to enrich other sectors with our skills in technology. We cater to all skill levels from hobbyist to student to senior professional.',
        opportunityType: 'club',
        sponsor: 'philipjohnson',
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
        interests: ['hardware', 'entrepreneurship', 'application-development'],
        moreInformation: 'http://acmanoa.github.io/',
        ice: { i: 10, c: 0, e: 10 },
      },
      {
        name: 'Shidler Business Plan Competition',
        slug: 'shidler-bpc',
        description: 'The annual Shidler Business Plan competition is an intense and unique semester-long learning opportunity for UH students who aspire to pursue a business venture. The competition provides mentorship, training and resources. Winners walk away with a wealth of business savvy and substantial cash prizes. ',
        opportunityType: 'event',
        sponsor: 'philipjohnson',
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
        interests: ['entrepreneurship'],
        moreInformation: 'http://htdc.org/wetwarewed/',
        ice: { i: 10, c: 0, e: 10 },
      },
    ];
  },
});

Template.Add_Opportunity.events({
  // add your events here
});

Template.Add_Opportunity.onCreated(function () {
  // add your statement here
});

Template.Add_Opportunity.onRendered(function () {
  // add your statement here
});

Template.Add_Opportunity.onDestroyed(function () {
  // add your statement here
});

