# JSDoc

Documentation for the RadGrad data model is generated using [JSDoc](http://usejsdoc.org/) with the [docdash](https://github.com/clenemt/docdash) theme.
 
To generate the documentation locally, invoke:

```
app$ meteor npm run jsdoc
```

This command places the JSDoc output into the [gitbook/api/jsdocs](https://github.com/radgrad/radgrad/tree/master/gitbook/api/jsdocs) subdirectory.  The GitBook [summary.md](https://github.com/radgrad/radgrad/blob/master/gitbook/SUMMARY.md) includes a link to the online GitBook's subdirectory where the JSDocs are located.

In future, we might want to explore the use of jsdoc-to-markdown to create API documentation that is better integrated with GitBook. 

Note that the generation of the JSDocs and their incorporation into the GitBook subdirectory is currently manual. At some point in the future, it would be good to automatically run jsdoc to ensure that the JSDocs are up to date. 