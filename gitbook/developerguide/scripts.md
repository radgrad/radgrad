# Development scripts

We use the following scripts for development. They are specified in [package.json](https://github.com/radgrad/radgrad/blob/master/app/package.json)

### meteor npm run start {#meteor-npm-run-start}

`meteor npm run start` is the standard command to invoke RadGrad in development mode.  This configures the system using [settings.development.json](https://github.com/radgrad/radgrad/blob/master/config/settings.development.json). 

### meteor npm run lint {#meteor-npm-run-lint}

`meteor npm run lint` runs ESLint from the command line.  We configure ESLint in [.eslintrc](https://github.com/radgrad/radgrad/blob/master/app/.eslintrc). 

This command is also specified as the "pretest" script, which means it will be run implicitly when you invoke the "test" script for unit testing.

Any ESLint errors fails the build in continuous integration.

### meteor npm run test {#meteor-npm-run-test}

`meteor npm run test` runs the "unit tests", which are server-side tests intended to ensure that the RadGrad data model is implemented correctly. 

See the [Testing](./testing.md) chapter for more detail.

### meteor npm run test-app {#meteor-npm-run-test-app}

`meteor npm run test-app` runs the "integration tests", which are client-initiated tests intended to ensure that client-server communication is implemented correctly.

See the [Testing](./testing.md) chapter for more detail.

### meteor npm run jsdoc {#meteor-npm-run-jsdoc}

`meteor npm run jsdoc` generates code-level documentation by running JSDoc over the source files. 

See the [JSDoc](./jsdoc.md) chapter for more detail.

### meteor npm run deploy

`meteor npm run deploy` deploys the system to Galaxy. 

See the [Deployment](./deployment.md) chapter for more detail. 













