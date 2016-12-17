/* global alert */

/**
 * THIS IS NOT A BASE MONGO COLLECTION - It is a METEOR-FILES Collection.
 * Created by Cam Moore on 12/16/16.
 */

import { Meteor } from 'meteor/meteor';

const uploadDir = './assets/app/startemp';

export const meteorFilesConfig = {};

if (Meteor.server) {
  meteorFilesConfig.storagePath = uploadDir;
}

meteorFilesConfig.debug = true;
meteorFilesConfig.collectionName = 'StarUploadCollection';
meteorFilesConfig.allowClientCode = true;  // allow file removal
meteorFilesConfig.onBeforeUpload = (file) => {
  if (file.size <= 1024 * 1024 * 20 && /csv/i.test(file.extension)) {
    return true;
  }
  return 'Please upload a STAR file less than 20MB with .csv extension.';
};

/**
 * Wrapper class for uploading STAR data and processing it. Uses the Meteor.Files package.
 */
class StarUploadCollection {

  constructor(config) {
    this.MeteorFiles = new Meteor.Files(config);
  }
  uploadStarData(fileObj, studentID) {
    const uploadInstance = this.MeteorFiles.insert({
      file: fileObj,
      meta: { studentID },
      streams: 'dynamic',
      chunkSize: 'dynamic',
    }, false);

    uploadInstance.on('start', function start() {
      // nothing to do.
    });

    uploadInstance.on('end', function end(error, fileObject) {
      if (error) {
        alert(`Error during upload: ${error.reason}`);  // eslint-disable-line no-alert
      } else {
        alert(`File "${fileObject.name}" successfully uploaded`);
        // Method call to process the STAR data.
      }
    });

    uploadInstance.start();
  }
}

export const StarUploads = new StarUploadCollection(meteorFilesConfig);
