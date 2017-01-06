// TODO: Seems like this data should be incorporated into the DesiredDegree collection.

export const BS_CS = {
  requiredCourses: ['ics111', 'ics141', 'ics211', 'ics212', 'ics241', 'ics311',
    ['ics312', 'ics331'], ['ics313', 'ics361'], 'ics314', 'ics321', 'ics332'],
  electiveCourses: ['ics414', 'ics415', 'ics419', 'ics421', 'ics422', 'ics423', 'ics425', 'ics426', 'ics431',
    'ics432', 'ics435', 'ics441', 'ics442', 'ics443', 'ics451', 'ics452', 'ics455', 'ics461', 'ics462', 'ics464',
    'ics465', 'ics466', 'ics469', 'ics471', 'ics475', 'ics476', 'ics481', 'ics483', 'ics484', 'ics484', 'ics491'],
  electiveReqts: '5 x 4?? upto 3 499 credits and 6 ics491',
};

export const BS_CS_TEMPLATE = {
  ay1: {
    fallSem: ['ics111', 'ics141'],
    springSem: ['ics211', 'ics241'],
  },
  ay2: {
    fallSem: ['ics311', 'ics314'],
    springSem: ['ics212', 'ics321'],
  },
  ay3: {
    fallSem: [['ics313', 'ics361'], ['ics312', 'ics331']],
    springSem: ['ics332', 'ics4xx'],
  },
  ay4: {
    fallSem: ['ics4xx', 'ics4xx'],
    springSem: ['ics4xx', 'ics4xx'],
  },
};

export const BS_CS_LIST = ['ics111', 'ics141', 'ics211', 'ics241', 'ics311', 'ics314', 'ics212', 'ics321',
  ['ics313', 'ics361'], ['ics312', 'ics331'], 'ics332', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx', 'ics4xx'];

export const BS_CS_SECSCI = {
  requiredCourses: ['ics111', 'ics141', 'ics211', 'ics212', 'ics241', 'ics311',
    'ics314', 'ics321', 'ics332', 'ics355', ['ics315', 'ics351']],
  electiveCourses: ['ics423', 'ics455', ['ics414', 'ics464'], ['ics325', 'ics426'], ['ics491', 'ics495']],
  electiveReqts: '5 x 4??',
};

export const BS_CS_SECSCI_TEMPLATE = {
  ay1: {
    fallSem: ['ics111', 'ics141'],
    springSem: ['ics211', 'ics241', 'ics222'],
  },
  ay2: {
    fallSem: ['ics311', 'ics314'],
    springSem: ['ics212', 'ics355'],
  },
  ay3: {
    fallSem: ['ics455'],
    springSem: [['ics321', 'ics332', 'ics351'], ['ics414', 'ics415', 'ics464']],
  },
  ay4: {
    fallSem: [['ics321', 'ics332', 'ics351'], 'ics423'],
    springSem: [['ics425', 'ics426', 'ics491', 'ics495'], ['ics441', 'ics451']],
  },
};


// Not for the first iteration.
// export const BS_CE = {};

export const BA_ICS = {
  requiredCourses: ['ics111', 'ics141', 'ics211', 'ics212', 'ics241', 'ics311',
    ['ics312', 'ics331'], ['ics313', 'ics361'], 'ics314', 'ics321'],
  electiveCourses: ['ics414', 'ics415', 'ics419', 'ics421', 'ics422', 'ics423', 'ics425', 'ics426', 'ics431',
    'ics432', 'ics435', 'ics441', 'ics442', 'ics443', 'ics451', 'ics452', 'ics455', 'ics461', 'ics462', 'ics464',
    'ics465', 'ics466', 'ics469', 'ics471', 'ics475', 'ics476', 'ics481', 'ics483', 'ics484', 'ics484', 'ics491'],
  electiveReqts: '3 x 4?? upto 3 499 credits and 3 ics491',
};

export const BA_ICS_TEMPLATE = {
  ay1: {
    fallSem: ['ics111', 'ics141'],
    springSem: ['ics211', 'ics241'],
  },
  ay2: {
    fallSem: ['ics311', 'ics314'],
    springSem: ['ics212', 'ics321'],
  },
  ay3: {
    fallSem: [['ics312', 'ics331']],
    springSem: ['ics332'],
  },
  ay4: {
    fallSem: [['ics313', 'ics361']],
    springSem: ['ics4xx'],
  },
};

export const BA_ICS_LIST = ['ics111', 'ics141', 'ics211', 'ics241', 'ics311', 'ics314', 'ics212', 'ics321',
  ['ics312', 'ics331'], 'ics332', ['ics313', 'ics361'], 'ics4xx'];

export const BA_ICS_SECSCI = {
  requiredCourses: ['ics111', 'ics141', 'ics211', ['ics212', 'ics215'], 'ics222', 'ics241', 'ics311',
    'ics314', 'ics321', 'ics332', 'ics351', 'ics355', 'ics414', 'ics455'],
  electiveCourses: [['ics415', 'ics423'], ['ics425', 'ics426', 'ics491', 'ics495'], ['ics441', 'ics451']],
  electiveReqts: '',
};

export const BA_ICS_IT = {
  requiredCourses: ['ics111', 'ics141', 'ics211', 'ics215', 'ics222', 'ics241', 'ics311',
    'ics314', 'ics315', 'ics321', 'ics351', 'ics355', 'ics414', 'ics425', 'ics426', 'ics464'],
  electiveCourses: ['ics415', 'ics419', 'ics421', 'ics422', 'ics423', 'ics426', 'ics431',
    'ics432', 'ics435', 'ics441', 'ics442', 'ics443', 'ics451', 'ics452', 'ics455', 'ics461',
    'ics465', 'ics466', 'ics469', 'ics471', 'ics475', 'ics476', 'ics481', 'ics483', 'ics484', 'ics484', 'ics491'],
  electiveReqts: 'two ICS courses at the 300-level or above',
};

export const BA_ICS_IT_TEMPLATE = {
  ay1: {
    fallSem: ['ics111', 'ics141'],
    springSem: ['ics211', 'ics241', 'ics222'],
  },
  ay2: {
    fallSem: ['ics311', 'ics314'],
    springSem: ['ics414', 'ics355'],
  },
  ay3: {
    fallSem: ['ics321', 'ics212'],
    springSem: ['ics351', 'ics425'],
  },
  ay4: {
    fallSem: ['ics3xx', 'ics426', 'ics415'],
    springSem: ['ics3xx', 'ics332', 'ics464'],
  },
};
