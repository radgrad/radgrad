# Interest

Interests are a central organizing feature of RadGrad.  They are used to:
 
* Connect students based on their interests with courses, projects, mentors, other students, graduates, internships, professors, and other activities.  

* Help students filter the large set of potential time investments during their degree program to those that will provide the most "return on investment" with respect to their interests. 

* Support recommendations.

The set of Interests are curated by the faculty and advisors. All users are encouraged to propose new Interests, but only faculty and advisors can define them.

Interests have the following structure:

* *Name:*  The name of the interest, for example, "Software Engineering". Names must be unique.

* *Slug:*  A system-generated unique ID for the tag, suitable for a URL.  Created automatically from the name by lowercasing and substituting dashes for spaces.  If the name is "Software Engineering", the slug is "software-engineering". 

* *Description:*  A one to two paragraph description of what the interest means, possibly augmented with images or links.  
 
* *InterestType:*  Partitions interests into logically related groupings. For example:
 
  * *CS disciplines:*  visualization, software engineering, artificial intelligence, networking, human-computer interaction, security, algorithms, bioinformatics, computer vision, high-performance computing, user modeling, databases and data mining, machine learning, medical informatics, robotics, data science, etc.
  
  * *Non-CS disciplines:*  Economics, Biology, Art, Physics, Astronomy, Chemistry, Math, Engineering, Education, Business, Medicine, Hawaiian Studies, Geography, Languages, Law, Oceanography, Social sciences, Agriculture, Women's Studies, etc. 
  
  * *Career locations:*  Hawaii, Silicon Valley, mainland, Asia, Europe, South America, Africa, etc.
  
  * *Professional goals:*  Professor, CEO, software designer, etc.
   
  * *Social interests:*  sustainability, renewable energy, social change, etc.

Note the difference between interests and opportunities.  An opportunity is an activity that the user can engage with, such as an event or a project.   Interests are used to classify behaviors.  So, for example, the opportunity "Hawaii Annual Code Challenge 2016" might have the interest "Software Engineering" associated with it. 

It will be interesting to explore the appropriate user interface to Interests.  For example, it may be useful to display a tag with a number indicating the number of students who have listed it in their home page as a professional interest or career goal. It may be useful to provide the description as a popup when the user clicks on (or mouses over) an interest.

## Implementation

See [InterestCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-Interest-InterestCollection.html) and [InterestTypeCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-InterestType-InterestTypeCollection.html).
  
