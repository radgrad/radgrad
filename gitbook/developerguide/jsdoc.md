# JSDoc

Documentation for the RadGrad data model is generated using [JSDoc](http://usejsdoc.org/) with the [radgrad-jsdoc-template](https://github.com/radgrad/jsdoc-template) a modification of the [docdash](https://github.com/clenemt/docdash) theme.

### RadGrad JSDoc Conventions

Documented Classes, functions, variables should all be in a namespace. We define the namespaces in the **index.js** files that import the code. The namespace is the path to the files. For example, the  api/base/index.js looks like:
```
/** @namespace api/base */

import './BaseCollection';
import './BaseCollection.methods';
import './BaseSlugCollection';
import './BaseTypeCollection';
import './BaseUtilities';
```
 
To make a class, method, etc part of the namespace use the *@memberOf* tag. Here's an example of the dumpDatabaseMethod in api/base. 
```
/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the RadGrad database.
 * @memberOf api/base
 */
export const dumpDatabaseMethod = new ValidatedMethod({
...
}
```

If there isn't a namespace defined for your documentation, update the index.js file to create the namespace. *Note:* JSDoc comments not in a namespace are 'Global' and will appear at the end of the navigation menu.

### Generating Documentation

To generate the documentation locally, invoke:

```
app$ meteor npm run jsdoc
```

This command places the JSDoc output into the [gitbook/api/jsdocs](https://github.com/radgrad/radgrad/tree/master/gitbook/api/jsdocs) subdirectory.  The GitBook [summary.md](https://github.com/radgrad/radgrad/blob/master/gitbook/SUMMARY.md) includes a link to the online GitBook's subdirectory where the JSDocs are located.

Note that the generation of the JSDocs and their incorporation into the GitBook subdirectory is currently manual. At some point in the future, it would be good to automatically run jsdoc to ensure that the JSDocs are up to date.

### Updating the RadGrad JSDoc Template

The RadGrad JSDoc Template is an NPM package that is loaded by RadGrad. Currently, only Cam can update the JSDoc Template since it needs to be published to NPM. 

1) Clone the [radgrad-jsdoc-template](https://github.com/radgrad/jsdoc-template) repository.

2) Make changes to the template.

3) Commit the changes. You have to commit your changes before trying to update the version number.

4) Update the NPM version number. 
```
[~/RadGrad/jsdoc-template] $ npm version patch
v1.1.2
``` 
The choices are 'patch', 'minor', or 'major'. This will commit the new version number to GitHub.

5) Publish the package to NPM. 
```
[~/RadGrad/jsdoc-template] $ npm publish
+ radgrad-jsdoc-template@1.1.2
```

6) Switch to RadGrad and update the radgrad-jsdoc-template.
```
app$ meteor npm install radgrad-jsdoc-template --save-dev
``` 
This will save the latest version of the template in the package.json file.

7) Generate the documentation. 
```
app$ meteor npm run jsdoc
``` 
Check to see if your changes to the template look good. Repeat from step 2.

8) Commit the new documentation.
