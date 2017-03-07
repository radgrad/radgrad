To update radgrad.ics.hawaii.edu (Philip's instructions)

$ ssh casanova@radgrad.ics.hawaii.edu
$ cd RADGRAD/radgrad/deploy
$ git pull
$ ./setup_as_<TAB>
$ # at end, cut and past the yellow restart instructions (there are three commands)
$ # wait 30 seconds.

To blow away Mongo collections (this is approximate):
$ mongo --port 6003
> use admin
> db.dropDatabase()
> ctrl-C

StackOverFlow:
http://stackoverflow.com/questions/3366397/delete-everything-in-a-mongodb-database

DOCS
* setup_as_a_service_on_ITS_vm.sh:
	Master script that should be edited and executed on the ITS VM

* create_and_install_bundle.sh (called by setup_as_a_service_on_ITS_vm.sh):
	Script to create and install the npm bundler for this app,
        which takes a while and can lead to errors that require
        manual installation of some npm packages

* run_as_local_meteor_application.sh:
	Script to run the app manually on the command line as a standard
	meteor app

* run_as_node_application.sh
	Script to run the app as an npm bundle on the command line
	(provided that ./create_and_install_bundle.sh has already been
	executed)

* generate_init.d_script.sh (called by setup_as_a_service_on_ITS_vm.sh):
	Script to generate the RHEL6 service script


