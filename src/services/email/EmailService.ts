import VerificationEmailTemplate from './templates/VerificationEmailTemplate';
import InvitationEmailTemplate from './templates/InvitationEmailTemplate';
import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import path from 'path';
import fs from 'fs';

interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailServiceConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const template = new VerificationEmailTemplate();
    const html = template.render({ verificationLink: `${process.env.BASE_URL}/verify?token=${token}` });
    
    await this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      html
    });
  }

  async sendTenantInvitation(email: string, invitationToken: string, tenantName: string): Promise<void> {
    const template = new InvitationEmailTemplate();
    const html = template.render({ 
      invitationLink: `${process.env.BASE_URL}/invite?token=${invitationToken}`,
      tenantName
    });

    await this.sendEmail({
      to: email,
      subject: `You've been invited to join ${tenantName}`,
      html
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        ...options
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      throw new Error('Failed to send email due to an unknown error');
    }
  }
}

export default EmailService;
