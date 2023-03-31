export interface newChatObject {
  userId: string;
  type: 'system' | 'user';
  message: string;
  timestamp: string;
}
export interface chatObject {
  _id?: string;
  userId: string;
  type: 'system' | 'user';
  message: string;
  timestamp: string;
}

export interface ChatBaseClass {
  getChatLog(userId: string): Promise<chatObject[]>;
  addChatMessage(userID: string, type: string, message: string, timestamp: string): Promise<chatObject>;
}
