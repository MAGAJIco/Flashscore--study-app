
import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

interface LiveMatchUpdate {
  matchId: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  events: string[];
  timestamp: Date;
}

class WebSocketService {
  private clients: Map<string, Set<any>> = new Map();

  async register(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);

    fastify.get('/ws/live-matches/:matchId', { websocket: true }, (connection, req) => {
      const matchId = (req.params as any).matchId;
      
      if (!this.clients.has(matchId)) {
        this.clients.set(matchId, new Set());
      }
      
      this.clients.get(matchId)!.add(connection.socket);

      connection.socket.on('message', (message: Buffer) => {
        const data = JSON.parse(message.toString());
        console.log(`📡 Received from client:`, data);
      });

      connection.socket.on('close', () => {
        this.clients.get(matchId)?.delete(connection.socket);
        if (this.clients.get(matchId)?.size === 0) {
          this.clients.delete(matchId);
        }
      });

      // Send initial connection confirmation
      connection.socket.send(JSON.stringify({
        type: 'connected',
        matchId,
        timestamp: new Date().toISOString()
      }));
    });

    // General live updates channel
    fastify.get('/ws/live', { websocket: true }, (connection) => {
      const clientId = `client_${Date.now()}`;
      
      if (!this.clients.has('global')) {
        this.clients.set('global', new Set());
      }
      
      this.clients.get('global')!.add(connection.socket);

      connection.socket.on('close', () => {
        this.clients.get('global')?.delete(connection.socket);
      });
    });
  }

  broadcastMatchUpdate(matchId: string, update: LiveMatchUpdate) {
    const clients = this.clients.get(matchId);
    if (clients) {
      const message = JSON.stringify({
        type: 'match_update',
        data: update
      });

      clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(message);
        }
      });
    }
  }

  broadcastGlobal(event: any) {
    const clients = this.clients.get('global');
    if (clients) {
      const message = JSON.stringify(event);
      
      clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    }
  }

  getStats() {
    const stats: any = {};
    this.clients.forEach((clients, matchId) => {
      stats[matchId] = clients.size;
    });
    return stats;
  }
}

export const websocketService = new WebSocketService();
