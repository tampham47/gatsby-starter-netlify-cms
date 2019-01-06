'use strict';

var child_process = require('child_process');

// trigger liquidfan to build from `master` every 15 mins
exports.trigger = (event) => {
  child_process.exec(
    `curl -X POST -d {} https://api.netlify.com/build_hooks/5c308dc82e69b94cee3294cd`,
    (error, stdout, stderr) => {
      if (!error) {
        console.log('Awesome, your build is in queue, check out more detail in netlify!');
        return 0;
      }
      console.log('Ahh, something went wrong, check again duke, here the details', error);
      return -1;
    }
  );
};
