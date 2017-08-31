# Cloudinary Image Service


RadGrad requires the ability for users to upload images. Students, Faculty, Advisors, and Mentors all want to upload profile pictures. Those who wish to define opportunities may want to upload images to accompany their descriptions. 

Some of the issues involved in image uploading include:

  * Meteor/Galaxy does not provide facilities for file storage.  All RadGrad deployments must interface to some sort of cloud-based file storage system.
  
  * The most common image needed for RadGrad is a profile picture, which must be square. From prior experience, getting users to successfully upload a square profile image file is difficult and error-prone.  
  
  * Profile images are served in a variety of contexts, and are always less than 300x300 pixels (typically around 50kb file size).  Typical smart phone picture files are approximately 100 times larger (3-5 MB in size). Since RadGrad explorer pages can easily contain dozens of profile pictures, it is essential to ensure that image files are small in size.  From prior experience, getting users to compress their image files prior to uploading is, from a pragmatic perspective, impossible.
  
To deal with these issues in image management, RadGrad uses [Cloudinary](http://cloudinary.com/). Cloudinary provides image file storage and a widget that can be configured to require users to crop their images into squares on upload. In addition, Cloudinary can automatically store a reduced resolution version of the image provided by users, regardless of its original size. Finally, Cloudinary has a [free tier](http://cloudinary.com/pricing) that allows 75K total images, 2GB of managed storage, and 5GB of monthly downloads. We are currently using the free tier for the ICS deployment.
  
For more details on how RadGrad integrates Cloudinary, please see the documentation associated with [meteor-example-cloudinary](https://ics-software-engineering.github.io/meteor-example-cloudinary/).