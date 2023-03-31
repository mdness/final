import { Server } from 'socket.io';
import moment from 'moment';
import { Logger } from '../utils/logger';
import { chatAPI } from '../apis/chatAPI';
import { checkAuth } from '../middlewares/auth';
import { UserObject } from '../models/users/users.interface';
import { chatBot } from '../middlewares/chatBot';

const initWsServer = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    Logger.debug('Conexion por sockets establecida');

    let user: UserObject = {} as UserObject;

    socket.on('chatUserToken', async (data) => {
      try {
        const token = data;
        user = (await checkAuth(token)) as UserObject;
        if (!user._id) socket.emit('chatLog', [{ from: 'System', message: 'Invalid token' }]);
        Logger.debug(JSON.stringify(user._id));
        const chatLog = await chatAPI.getChatLog(user._id);
        socket.emit('chatLog', chatLog);
      } catch (err) {
        Logger.error(err);
        socket.emit('chatLog', [{ from: 'System', message: 'Invalid token' }]);
      }
    });

    socket.on('chatBotQuery', async (messageData) => {
      if (!user._id) {
        socket.emit('chatLog', [{ from: 'System', message: 'You Must Load a valid Token to speak to the ChatBot' }]);
      } else {
        try {
          const newMessage = {
            UserId: JSON.stringify(user._id),
            from: 'User',
            message: messageData.message,
            date: moment().format('DD/MM/YYYY HH:mm:ss')
          };
          await chatAPI.addChatMessage(newMessage.UserId, newMessage.from, newMessage.message, newMessage.date);
          socket.emit('chatLog', [newMessage]);
          const response = await chatBot(user._id, newMessage);
          await chatAPI.addChatMessage(response.UserId, response.from, response.message, response.date);
          socket.emit('chatLog', [response]);
        } catch (err: any) {
          Logger.error(err.message);
          socket.emit('chatLog', [
            { from: 'System', message: 'Sorry, we have a problem with chat. Reload and try again.' }
          ]);
        }
      }
    });
  });

  return io;
};

export default initWsServer;
