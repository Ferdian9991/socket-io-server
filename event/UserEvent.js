const { responseMessage } = require('../init-config');
const userResolver = require('../database/schema/User/resolvers');
const yup = require('yup');

class UserEvent {
   async signUp(payload, socket, res) {
      let message = '';
      if (typeof payload === 'object') {
         const validate = yup.object().shape({
            username: yup.string().required(),
            email: yup.string().required(),
            mobileNumber: yup.string().required(),
            password: yup.string().required(),
         });
         const isValid = await validate.isValid(payload);
         if (
            !isValid
         ) {
            message = 'Required parameters missing!!';
            socket.emit(
               res,
               responseMessage({
                  statusCode: 400,
                  auth: false,
                  message,
               })
            );

            throw new Error(message);
         } else {
            const foundUser = await userResolver.findByUsername(payload);

            if (foundUser) {
               message = `Username is already taken!`;
               socket.emit(
                  res,
                  responseMessage({
                     statusCode: 400,
                     auth: false,
                     message,
                  })
               );
               throw new Error(message);
            }

            const response = await userResolver.register(payload);

            socket.emit(
               res,
               responseMessage({
                  statusCode: 200,
                  auth: false,
                  message: `Successfully register ${response.username}`,
                  data: response,
               })
            );
         }
      } else {
         socket.emit(
            res,
            responseMessage({
               statusCode: 400,
               auth: false,
               message: 'invalid payload!!',
            })
         );
      }
   }

   async signIn(payload, socket, res) {
      let message = '';
      if (typeof payload === 'object') {
         const validate = yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required(),
         });
         const isValid = await validate.isValid(payload);
         if (!isValid) {
            message = 'Required parameters missing!!';
            socket.emit(
               res,
               responseMessage({
                  statusCode: 400,
                  auth: false,
                  message,
               })
            );

            throw new Error(message);
         } else {
            const response = await userResolver.auth(payload);

            if (response) {
               message = `Logged in as ${response.fullname}`;
               socket.token = response._token;
               socket.emit(
                  res,
                  responseMessage({
                     statusCode: 200,
                     auth: true,
                     message,
                     data: response,
                  })
               );
            } else {
               message = `Invalid login credentials`;
               socket.emit(
                  res,
                  responseMessage({
                     statusCode: 400,
                     auth: false,
                     message,
                  })
               );
            }
         }
      } else {
         socket.emit(
            res,
            responseMessage({
               statusCode: 400,
               auth: false,
               message: 'invalid payload!!',
            })
         );
      }
   }
}

module.exports = new UserEvent();
