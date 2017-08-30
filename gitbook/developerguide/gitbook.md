# GitBook

This manual is produced using [GitBook](http://gitbook.com).

The top-level [book.json](https://github.com/radgrad/radgrad/blob/master/book.json) file provides global configuration information, and also tells GitBook that the files are all located in the gitbook/ subdirectory.

To develop GitBook documentation, you will want to [install GitBook locally](http://toolchain.gitbook.com/setup.html). Then run `gitbook install` followed by `gitbook serve` at the top-level of the radgrad repo to build a local version of the book:

```
[~/github/radgrad/radgrad]-> gitbook serve
Live reload server started on port: 35729
Press CTRL+C to quit ...

info: 8 plugins are installed 
info: 7 explicitly listed 
info: loading plugin "anchors"... OK 
info: loading plugin "livereload"... OK 
info: loading plugin "highlight"... OK 
info: loading plugin "search"... OK 
info: loading plugin "lunr"... OK 
info: loading plugin "fontsettings"... OK 
info: loading plugin "theme-default"... OK 
info: found 18 pages 
info: found 12 asset files 
info: >> generation finished with success in 6.3s ! 

Starting server ...
Serving book on http://localhost:4000
```

To create the API chapter, run `meteor npm run jsdoc`. This generates JSDocs and places them in the api/jdocs subdirectory. Note that we do not have any mechanism at present to auto-publish updated JSDocs upon each commit. Instead, this command must be run manually in the master branch in order for the JSDocs to be updated.

Currently I've set up a webhook to auto-publish the GitBook at [https://radgrad.gitbooks.io/radgrad-manual/content/](https://radgrad.gitbooks.io/radgrad-manual/content/) upon each commit to the master branch. 