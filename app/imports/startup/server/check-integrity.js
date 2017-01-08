import { checkIntegrity } from '/imports/api/integritychecker/IntegrityChecker';

// Invoke checkIntegrity on startup.
console.log(checkIntegrity().message);
