# JSDoc

Documentation for the RadGrad data model is generated using [JSDoc](http://usejsdoc.org/) with the [docdash](https://github.com/clenemt/docdash) theme.
 
To generate the documentation locally, invoke:

```
app$ meteor npm run jsdoc
```

Note that running this command will generate the HTML version of the documentation into a "sibling" directory of this repo specified as `../../datamodel-gh-pages`.  That directory should contain the gh-pages branch of this repo. 

To make the documentation globally available, commit the gh-pages branch, after which it will be accessable at [http://radgrad.org/datamodel/](http://radgrad.org/datamodel/).