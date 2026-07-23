import { AgentMessage } from './AgentMessage';

type MessageHandler = (message: AgentMessage) => void;

export class AgentBus {
  private static handlers = new Map<string, MessageHandler[]>();

  public static subscribe(receiver: string, handler: MessageHandler): void {
    if (!this.handlers.has(receiver)) {
      this.handlers.set(receiver, []);
    }
    this.handlers.get(receiver)!.push(handler);
  }

  public static publish(message: AgentMessage): void {
    console.log(`[AgentBus] MESSAGE_SENT: ${message.type} from ${message.sender} to ${message.receiver}`);
    const receiverHandlers = this.handlers.get(message.receiver) || [];
    const broadcastHandlers = this.handlers.get('*') || [];
    
    [...receiverHandlers, ...broadcastHandlers].forEach(handler => {
      try {
        handler(message);
      } catch (e) {
        console.error(`[AgentBus] Error handling message ${message.id}:`, e);
      }
    });
  }
}
