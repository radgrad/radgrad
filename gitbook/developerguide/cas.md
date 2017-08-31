# CAS Authentication

The ICS deployment of RadGrad uses the UH CAS authentication service to authenticate students, advisors, and faculty. (Mentors and the admin user are authenticated using the Meteor accounts package.)

For details on how to set up UH CAS authentication with Meteor, please see [meteor-example-uh-cas](http://ics-software-engineering.github.io/meteor-example-uh-cas/). RadGrad follows this procedure.

Note that when you run RadGrad using [settings.development.json](https://github.com/radgrad/radgrad/blob/master/config/settings.development.json) on localhost, authentication will occur to the UH test CAS server.  When running in production (i.e. to the Galaxy deployment), authentication occurs to the regular UH CAS server.  This configuration occurs in the settings.production.json file (this file is not committed to GitHub since it contains sensitive information).

