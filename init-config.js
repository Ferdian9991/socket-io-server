const _ = require('lodash');

const options = {
   appName: 'socket server',
   appVersion: '0.0.1',
   service: 'running',
   mobileNumberLocale: 'en-IN',
   minPasswordLength: 6,
   devicePlatforms: {
      ANDROID: 'android',
      IOS: 'ios',
   },
   user: {
      status: {
         ACTIVE: 'active',
         DISABLED: 'disabled',
      },
   },
   generateOtp: () => {
      return Math.floor(1000 + Math.random() * 9000);
   },
   responseMessage: ({ statusCode = 200, auth, message = '', data = {} }) => {
      return {
         auth,
         statusCode,
         message,
         data,
      };
   },
};

module.exports = options;
