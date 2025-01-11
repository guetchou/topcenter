class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket Message:', data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(() => this.connect(), 5000);
    };
  }

  public send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const wsService = new WebSocketService('ws://localhost:8080');