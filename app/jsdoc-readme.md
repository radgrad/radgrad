# RadGrad Javascript Documentation

Welcome to JSDocs for RadGrad. This documentation is organized according to four constructs:

*  *Namespace.* Namespaces are defined in RadGrad so that they are equivalent to directory paths. So, the namespace "api/base" comprises the code in the radgrad/app/imports/api/base directory.

* *Class*. Classes refer to Javascript classes. In RadGrad, classes are primarily used as an organizing mechanism to control access to the MongoDB collections. 

* *Member*. A member is a variable that is exported from any file contained within a directory associated with a namespace.

* *Method*. A method is function that is exported from any file contained within a directory associated with a namespace. When you click on a namespace, you will see these functions.   "Method" can also refer to the functions defined in a class definition; to see those, you need to expand a Class definition.

Note that this documentation must be manually generated by running `meteor npm run jsdoc` and then committing the results to GitHub. Because the developers generate the documentation manually, it will be a little out of date with the latest version of the code in master. If this is a problem, please request a refresh of the documentatio.


