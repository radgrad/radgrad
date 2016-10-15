# JSDoc

Documentation for the RadGrad data model is generated using [JSDoc](http://usejsdoc.org/) with the [docdash](https://github.com/clenemt/docdash) theme.
 
To generate the documentation locally, invoke:

```
app$ meteor npm run jsdoc
```

This command places the JSDoc output into the gitbook/api/jsdocs subdirectory.  The table of contents includes a link to the online GitBook's subdirectory where the JSDocs are located.

In future, we might want to explore the use of jsdoc-to-markdown to create API documentation that is better integrated with GitBook. 