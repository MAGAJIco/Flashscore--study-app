
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

interface EmailData {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  apiKey?: string;
  domain?: string;
  from: string;
  replyTo?: string;
}

export class EmailManager {
  private static instance: EmailManager;
  private config: EmailConfig;
  private templates: Map<string, EmailTemplate> = new Map();
  private queue: EmailData[] = [];
  private isProcessing = false;

  private constructor() {
    this.config = {
      provider: 'sendgrid',
      from: process.env.EMAIL_FROM || 'noreply@sportscentral.com',
      apiKey: process.env.EMAIL_API_KEY,
      domain: process.env.EMAIL_DOMAIN
    };
    
    this.initializeTemplates();
  }

  public static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  private initializeTemplates(): void {
    // Welcome email template
    this.templates.set('welcome', {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Sports Central! 🏆',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00ff88, #00a2ff); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Welcome to Sports Central!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <p>Hi {{username}},</p>
            <p>Welcome to Sports Central! We're excited to have you join our community of sports enthusiasts.</p>
            <p>You've received <strong>{{welcomeBonus}} Pi Coins</strong> to get you started!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{appUrl}}" style="background: linear-gradient(135deg, #00ff88, #00a2ff); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Exploring</a>
            </div>
            <p>Best regards,<br>The Sports Central Team</p>
          </div>
        </div>
      `,
      textContent: 'Welcome to Sports Central! You received {{welcomeBonus}} Pi Coins to get started.',
      variables: ['username', 'welcomeBonus', 'appUrl']
    });

    // Payment confirmation template
    this.templates.set('payment-success', {
      id: 'payment-success',
      name: 'Payment Confirmation',
      subject: 'Payment Confirmed - {{amount}} Pi Coins Added! 💰',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">💰 Payment Confirmed!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <p>Hi {{username}},</p>
            <p>Your payment has been successfully processed!</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Transaction Details:</h3>
              <p><strong>Amount:</strong> {{amount}} Pi Coins</p>
              <p><strong>Transaction ID:</strong> {{transactionId}}</p>
              <p><strong>Date:</strong> {{date}}</p>
            </div>
            <p>Your new balance is <strong>{{newBalance}} Pi Coins</strong>.</p>
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      `,
      textContent: 'Payment confirmed! {{amount}} Pi Coins added. Transaction ID: {{transactionId}}',
      variables: ['username', 'amount', 'transactionId', 'date', 'newBalance']
    });

    // Achievement notification template
    this.templates.set('achievement', {
      id: 'achievement',
      name: 'Achievement Unlocked',
      subject: 'Achievement Unlocked: {{achievementName}} 🏆',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ffd700, #ff8c00); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Achievement Unlocked!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa; text-align: center;">
            <div style="background: white; padding: 30px; border-radius: 16px; margin: 20px 0;">
              <div style="font-size: 48px; margin-bottom: 16px;">{{achievementIcon}}</div>
              <h2 style="color: #333; margin: 0 0 8px 0;">{{achievementName}}</h2>
              <p style="color: #666; margin: 0;">{{achievementDescription}}</p>
              <p style="color: #22c55e; font-weight: bold; margin-top: 16px;">+{{reward}} Pi Coins Earned!</p>
            </div>
            <p>Keep up the great work!</p>
          </div>
        </div>
      `,
      textContent: 'Achievement Unlocked: {{achievementName}}! You earned {{reward}} Pi Coins.',
      variables: ['achievementName', 'achievementIcon', 'achievementDescription', 'reward']
    });
  }

  // Send email with template
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Add to queue for batch processing
      this.queue.push(emailData);
      
      if (!this.isProcessing) {
        this.processQueue();
      }
      
      return true;
    } catch (error) {
      console.error('Email queue error:', error);
      return false;
    }
  }

  // Send templated email
  async sendTemplatedEmail(
    templateId: string,
    to: string | string[],
    variables: Record<string, any> = {}
  ): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) {
      console.error(`Template ${templateId} not found`);
      return false;
    }

    let subject = template.subject;
    let htmlContent = template.htmlContent;
    let textContent = template.textContent;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return this.sendEmail({
      to,
      subject,
      htmlContent,
      textContent
    });
  }

  // Process email queue (batch optimization)
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      const batch = this.queue.splice(0, 10); // Process 10 emails at a time
      
      for (const email of batch) {
        await this.sendSingleEmail(email);
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      }
      
      // Continue processing if more emails in queue
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000);
      }
    } catch (error) {
      console.error('Email processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Send individual email based on provider
  private async sendSingleEmail(emailData: EmailData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData);
        case 'mailgun':
          return await this.sendWithMailgun(emailData);
        case 'smtp':
          return await this.sendWithSMTP(emailData);
        default:
          console.error('Unsupported email provider');
          return false;
      }
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  private async sendWithSendGrid(emailData: EmailData): Promise<boolean> {
    // SendGrid implementation
    const payload = {
      personalizations: [{
        to: Array.isArray(emailData.to) 
          ? emailData.to.map(email => ({ email }))
          : [{ email: emailData.to }],
        subject: emailData.subject
      }],
      from: { email: this.config.from },
      content: [
        { type: 'text/plain', value: emailData.textContent || '' },
        { type: 'text/html', value: emailData.htmlContent || '' }
      ]
    };

    // In production, integrate with actual SendGrid API
    console.log('Sending with SendGrid:', payload);
    return true;
  }

  private async sendWithMailgun(emailData: EmailData): Promise<boolean> {
    // Mailgun implementation
    console.log('Sending with Mailgun:', emailData);
    return true;
  }

  private async sendWithSMTP(emailData: EmailData): Promise<boolean> {
    // SMTP implementation
    console.log('Sending with SMTP:', emailData);
    return true;
  }

  // Add custom template
  addTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template);
  }

  // Get all templates
  getTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Bulk email validation
  static validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];
    
    emails.forEach(email => {
      if (this.validateEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });
    
    return { valid, invalid };
  }
}

export const emailManagerInstance = EmailManager.getInstance();
