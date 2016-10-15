# GitBook

The documentation for this system is built using [GitBook](http://gitbook.com).

The top-level [book.json](https://github.com/radgrad/radgrad/blob/master/book.json) file provides global configuration information, and also tells GitBook that the files are all located in the gitbook/ subdirectory.

To develop GitBook documentation, you will want to [install GitBook locally](http://toolchain.gitbook.com/setup.html).

To create the API chapter, we use [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown). Cd into the app/ directory and run `npm run mddocs` to generate a markdown file which is placed into gitbook/api/jsdocs.md.  Currently the formatting of this file is not good; we probably want to create a [custom template](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/Create-a-README-template). 

Currently I've set up a webhook to auto-publish the GitBook at [https://philipmjohnson.gitbooks.io/radgrad-manual/content/](https://philipmjohnson.gitbooks.io/radgrad-manual/content/). I've requested that gitbook create a (free) RadGrad organization for us but am awaiting their reply.