
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

interface NotificationJob {
  id: string;
  type: 'match_alert' | 'prediction_result' | 'leaderboard_update';
  userId: string;
  data: any;
  scheduledAt: Date;
  status: 'pending' | 'sent' | 'failed';
}

class NotificationWorker {
  private queue: NotificationJob[] = [];
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('📬 Notification Worker started');

    // Process queue every 30 seconds
    this.interval = setInterval(() => this.processQueue(), 30000);
  }

  async stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('📬 Notification Worker stopped');
  }

  async addJob(job: Omit<NotificationJob, 'id' | 'status'>) {
    const notification: NotificationJob = {
      ...job,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };

    this.queue.push(notification);
    console.log(`📬 Job queued: ${notification.type} for user ${notification.userId}`);
  }

  private async processQueue() {
    const pending = this.queue.filter(job => 
      job.status === 'pending' && new Date(job.scheduledAt) <= new Date()
    );

    for (const job of pending) {
      try {
        await this.sendNotification(job);
        job.status = 'sent';
        console.log(`✅ Sent ${job.type} to user ${job.userId}`);
      } catch (error) {
        job.status = 'failed';
        console.error(`❌ Failed to send ${job.type}:`, error);
      }
    }

    // Clean up sent/failed jobs older than 1 hour
    const oneHourAgo = new Date(Date.now() - 3600000);
    this.queue = this.queue.filter(job => 
      job.status === 'pending' || new Date(job.scheduledAt) > oneHourAgo
    );
  }

  private async sendNotification(job: NotificationJob) {
    // Implement actual notification logic here
    // Could use push notifications, email, SMS, etc.
    switch (job.type) {
      case 'match_alert':
        console.log(`🚨 Match alert: ${job.data.match}`);
        break;
      case 'prediction_result':
        console.log(`🎯 Prediction result: ${job.data.result}`);
        break;
      case 'leaderboard_update':
        console.log(`🏆 Leaderboard update: ${job.data.position}`);
        break;
    }
  }

  getQueueStats() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(j => j.status === 'pending').length,
      sent: this.queue.filter(j => j.status === 'sent').length,
      failed: this.queue.filter(j => j.status === 'failed').length
    };
  }
}

export const notificationWorker = new NotificationWorker();
