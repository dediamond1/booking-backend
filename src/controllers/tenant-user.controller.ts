import { ErrorResponse } from '../utils/error';
import User from '../models/user.model';
import Organization from '../models/organization.model';
import Tenant from '../models/tenant.model';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
// @ts-ignore
import hbs from 'nodemailer-handlebars';
import path from 'path';
import argon2 from 'argon2';

const handlebarOptions: any = {
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve('./src/emails/'),
    layoutsDir: path.resolve('./src/emails/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/emails/invitation/'),
  extName: '.hbs',
};

export const getAllTenantUsersForOrganization = async (req: any, res: any) => {
  try {
    const organizationId = req.params.organizationId;

    if (!organizationId) {
      return res.status(400).send(new ErrorResponse('Organization ID is required.'));
    }

    const users = await User.find({ organizationId: organizationId });
    res.status(200).send(users);
  } catch (error: any) {
    console.error('Error fetching tenant users for organization:', error);
    res.status(500).send(new ErrorResponse('Failed to fetch tenant users for organization', error));
  }
};

export const getAllTenantUsers = async (req: any, res: any) => {
  try {
    const tenantId = req.params.tenantId;

    if (!tenantId) {
      return res.status(400).send(new ErrorResponse('Tenant ID is required.'));
    }

    const users = await User.find({ tenantId: tenantId });
    res.status(200).send(users);
  } catch (error: any) {
    console.error('Error fetching tenant users:', error);
    res.status(500).send(new ErrorResponse('Failed to fetch tenant users', error));
  }
};

export const deleteTenantUser = async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const tenantId = req.params.tenantId;

    if (!userId || !tenantId) {
      return res.status(400).send(new ErrorResponse('User ID and Tenant ID are required.'));
    }

    const user = await User.findOneAndDelete({ _id: userId, tenantId: tenantId });
    if (!user) {
      return res.status(404).send(new ErrorResponse('Tenant user not found.'));
    }

    res.status(200).send({ message: 'Tenant user deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting tenant user:', error);
    res.status(500).send(new ErrorResponse('Failed to delete tenant user', error));
  }
};

export const updateTenantUser = async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const tenantId = req.params.tenantId;
    const updateData = req.body;

    if (!userId || !tenantId) {
      return res.status(400).send(new ErrorResponse('User ID and Tenant ID are required.'));
    }

    const user = await User.findOneAndUpdate({ _id: userId, tenantId: tenantId }, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send(new ErrorResponse('Tenant user not found.'));
    }

    res.status(200).send({ message: 'Tenant user updated successfully', user });
  } catch (error: any) {
    console.error('Error updating tenant user:', error);
    res.status(500).send(new ErrorResponse('Failed to update tenant user', error));
  }
};

export const inviteTenantUser = async (req: any, res: any) => {
  try {
    const { email, tenantId, role, firstName, lastName } = req.body; // Expect firstName and lastName

    const organizationId = req.params.organizationId;

    if (!email || !tenantId || !role || !organizationId || !firstName || !lastName) { // Validate firstName and lastName
      return res.status(400).send(new ErrorResponse('Email, tenantId, role, organizationId, firstName, and lastName are required.'));
    }
 
    // Check if the user already exists
    let user = await User.findOne({ email });
    let temporaryPassword;

    if (!user) {
      // Generate a temporary password
      temporaryPassword = uuidv4().substring(0, 8);
      const hashedPassword = await argon2.hash(temporaryPassword);

      // Generate invitation token and expiration
      const invitationToken = uuidv4();
      const invitationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // If user doesn't exist, create a new user with a temporary password and invitation token
      user = new User({
        email,
        password: hashedPassword, // Set hashed temporary password
        firstName: firstName, // Use provided firstName
        lastName: lastName, // Use provided lastName
        organizationId: organizationId,
        isVerified: false, // User needs to verify email
        invitationToken: invitationToken,
        invitationTokenExpires: invitationTokenExpires,
      });
      await user.save();
    } else {
      temporaryPassword = 'User already exists, no new password generated';
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).send(new ErrorResponse('Tenant not found.'));
    }

    // Add tenantId and tenantRole to the user
    user.tenantId = tenantId;
    user.tenantRole = role;
    await user.save();

    // Fetch organization to get SMTP settings
    const organization = await Organization.findById(organizationId);
    let transporter = nodemailer.createTransport({
      host: organization?.smtpHost || process.env.SMTP_HOST,
      port: organization?.smtpPort || parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: organization?.smtpUser || process.env.SMTP_USER,
        pass: organization?.smtpPass || process.env.SMTP_PASS,
      },
    });

    transporter.use('compile', hbs(handlebarOptions));

    const invitationLink = `http://localhost:3000/accept-invitation?token=${user.invitationToken}`; // Replace with actual frontend URL

    const mailOptions = {
      from: organization?.smtpFromEmail || process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: `Invitation to join ${tenant.name}`,
      template: 'tenant-invitation-email', // Name of the handlebars template
      context: { // Pass data to the template
        tenantName: tenant.name,
        role: role,
        temporaryPassword: temporaryPassword,
        invitationLink: invitationLink, // Pass invitation link to template
        firstName: firstName, // Pass firstName to template
        lastName: lastName, // Pass lastName to template
      },
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Invitation email sent successfully', userId: user._id, invitationLink: invitationLink });
  } catch (error: any) {
    console.error('Tenant invitation error:', error);
    res.status(500).send(new ErrorResponse('Failed to send invitation', error));
  }
};

export const getTenantUser = async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const tenantId = req.params.tenantId;

    if (!userId || !tenantId) {
      return res.status(400).send(new ErrorResponse('User ID and Tenant ID are required.'));
    }

    const user = await User.findOne({ _id: userId, tenantId: tenantId });
    if (!user) {
      return res.status(404).send(new ErrorResponse('Tenant user not found.'));
    }

    res.status(200).send(user);
  } catch (error: any) {
    console.error('Error fetching tenant user:', error);
    res.status(500).send(new ErrorResponse('Failed to fetch tenant user', error));
  }
};
