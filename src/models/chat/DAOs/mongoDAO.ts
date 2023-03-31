import mongoose from 'mongoose';
import { Logger } from '../../../utils/logger';
import { ChatBaseClass, chatObject } from '../chat.interfaces';
import { MongoDB } from '../../../services/mongodb';

//MongoSchema
const dbCollection = 'chatLogs';
const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true }
});

export class PersistenciaMongo implements ChatBaseClass {
  private chatLog;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.chatLog = server.model<chatObject>(dbCollection, messageSchema);
  }

  // Exportar el modelo para usarlo en tests
  model(): any {
    return this.chatLog;
  }

  async getChatLog(userId: string): Promise<chatObject[]> {
    const chatLog = await this.chatLog.find({ userId });
    // No tiro error porque puede que no haya nada.
    if (!chatLog) Logger.warn('No se encontraron mensajes para el usuario, userId: ' + userId);
    return chatLog;
  }
  
  async addChatMessage(userId: string, type: string, message: string, timestamp: string): Promise<chatObject> {
    const chatLog = new this.chatLog({
      userId,
      type,
      message,
      timestamp
    });
    const result = await chatLog.save();
    if (!result) throw new Error('No se pudo guardar el mensaje');
    return result;
  }
}
