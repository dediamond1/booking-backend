import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

interface VerificationEmailTemplateData {
  verificationLink: string;
}

class VerificationEmailTemplate {
  private template: HandlebarsTemplateDelegate<VerificationEmailTemplateData>;

  constructor() {
    const templatePath = path.join(__dirname, 'verification/verification-email.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(templateSource);
  }

  public render(data: VerificationEmailTemplateData): string {
    return this.template(data);
  }
}
