# Meteor guidelines

Here are some guidelines for how we use Meteor.
 
### Avoid downloads {#avoid-downloads}

One reason Meteor can be unpredictably slow is because, by default, it checks for updates and downloads them automatically as part of the build process. 

Fortunately, you can disable this behavior for a given run of Meteor via a command-line argument:

```
$ meteor --no-release-check
```

If you want to disable the behavior globally, then you can set an environment variable:

```
METEOR_NO_RELEASE_CHECK=1
```

Note that although Meteor downloads updates in the background, it doesn't install them into your applications. For each application, you must manually install any updates using the command:

```
$ meteor update
```

### Perform meteor updates in separate branch {#update-in-branch}

The quality control on Meteor updates is at this point highly variable. Avoid updating Meteor in general.

To minimize the negative impact of Meteor updates, be sure to be in a new branch when you invoke `meteor update`.  If things don't go well, then we can revert back easily.

### meteor npm run start {#meteor-npm-run-start}

`meteor npm run start` is the standard command to invoke RadGrad in development mode.  This will load the settings.development.json file. 

### meteor npm run lint {#meteor-npm-run-lint}

`meteor npm run lint` runs ESLint from the command line.  There should be no ESLint errors. 

### meteor npm run test-watch {#meteor-npm-run-test-watch}

`meteor npm run test-watch` invokes the *.test.js files and display the results at http://localhost:3100. See the [Testing](./testing.md) chapter for details.








