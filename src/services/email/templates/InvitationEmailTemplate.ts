import fs from 'fs';
import path from 'path';
import handlebars, { TemplateDelegate } from 'handlebars';

interface InvitationEmailTemplateData {
  invitationLink: string;
  tenantName: string;
}

class InvitationEmailTemplate {
  private template: TemplateDelegate<InvitationEmailTemplateData>;

  constructor() {
    const templatePath = path.join(__dirname, 'invitation/tenant-invitation-email.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(templateSource);
  }

  public render(data: InvitationEmailTemplateData): string {
    return this.template(data);
  }
}

export default InvitationEmailTemplate;
