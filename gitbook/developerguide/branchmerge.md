# The RadGrad Master Branch Baton Pass

In RadGrad, most development occurs in branches off the master branch.  We have evolved the following process to synchronize our personal branches with each others and bring the master branch up to date.  It's called, for lack of a better name, the "Master Branch Baton Pass" process, and it goes like this:

The developers arrange themselves in alphabetical order by first name:  Aljon, Amy, Cam, Josephine, Philip. 

Someone (usually Philip) sends a message to the #development channel initiating a Master Branch Baton Pass.  

At that point, Aljon has the baton.  If he has changes in his branch that he wants to publish, then he:

  1. Syncs his local repo with GitHub.
  2. Pulls the current master branch into his personal development branch.
  2. Fixes any merge conflicts.
  3. Pushes his branch into master.
  4. Syncs his local repo with GitHub.
  5. Sends this message to the #development channel: "My branch is merged with master. Passing baton to @amytakeyesu".
  
If Aljon does not have any changes he wants to merge, then he can send this message to #development: "I have no changes to publish. Passing baton to @amytakeyesu".

This sequence of merges continues through the list of developers: Amy, Cam, Philip, and Josephine. Each developer sends a message to #development when finished, explicitly indicating the next developer who has the baton.

Once Josephine has completed her merge, the master branch now contains the latest version of the system.

At that point, everyone (except Josephine) can do a final merge from master into their development branch to make sure they continue work off the lastest version of the system. 

Please do not "hold" the baton for more than a half a day.  It's fine if you're not ready to commit your changes; just pass the baton to the next person and wait until the next go round.
