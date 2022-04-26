const UserEvent = require('./UserEvent');

const event = (io) => {
   io.on('connection', (socket) => {
      console.log(`connected socket ${socket.id}!`);

      socket.on('message', (message) => {
         console.log(`message from ${socket.id} : ${message}`);
         console.log(socket.token)
      });

      socket.on('sign-up', (payload) => {
         UserEvent.signUp(payload, socket, 'sign-up-response');
      });

      socket.on('sign-in', (payload) => {
         UserEvent.signIn(payload, socket, 'sign-in-response');
      });

      socket.on('disconnect', () => {
         console.log(`socket ${socket.id} disconnected`);
      });
   });
};

module.exports = { event };
