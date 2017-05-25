import { checkIntegrity } from './IntegrityChecker';

// Invoke checkIntegrity on startup, print out message if integrity issues were found.
console.log('Checking integrity of database...');

const integrity = checkIntegrity();
if (integrity.count > 0) {
  console.log(checkIntegrity().message);
}

console.log('... completed.');
