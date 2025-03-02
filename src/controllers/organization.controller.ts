import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

import Organization from '../models/organization.model';
import User from '../models/user.model';
import { ErrorResponse } from '../utils/error';

export const registerOrganization = async (req: any, res: any) => {
  try {
    const { name, legalStructure, businessIdentificationNumber, taxVatId, ownerAdminUser } = req.body;
    // Assuming user is attached to the request by auth middleware
    if (!ownerAdminUser) {
      return res.status(401).send(new ErrorResponse('User not authenticated'));
    }

    if (!name) {
      return res.status(400).send(new ErrorResponse('Organization name is required.'));
    }

    const organization = new Organization({
      name,
      legalStructure,
      businessIdentificationNumber,
      taxVatId,
      ownerAdminUser,
    });

    await organization.save();

    // Update user role to Organization Admin
    await User.findByIdAndUpdate(ownerAdminUser, {
      role: 'OrganizationAdmin',
      organizationId: organization._id,
    });

    res.status(201).send({ message: 'Organization registered successfully', organizationId: organization._id });
  } catch (error: any) {
    console.error('Organization registration error:', error);
    res.status(500).send(new ErrorResponse('Failed to register organization', error));
  }
};

export const getOrganization = async (req: any, res: any) => {
  try {
    const organizationId = req.params.organizationId;
    if (!organizationId) {
      return res.status(400).send(new ErrorResponse('Organization ID is required.'));
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).send(new ErrorResponse('Organization not found.'));
    }

    res.status(200).send(organization);
  } catch (error: any) {
    console.error('Error fetching organization:', error);
    res.status(500).send(new ErrorResponse('Failed to fetch organization', error));
  }
};

export const updateOrganization = async (req: any, res: any) => {
  try {
    const organizationId = req.params.organizationId;
    const updateData = req.body;

    if (!organizationId) {
      return res.status(400).send(new ErrorResponse('Organization ID is required.'));
    }

    const organization = await Organization.findByIdAndUpdate(organizationId, updateData, { new: true, runValidators: true });
    if (!organization) {
      return res.status(404).send(new ErrorResponse('Organization not found.'));
    }

    res.status(200).send({ message: 'Organization updated successfully', organization });
  } catch (error: any) {
    console.error('Error updating organization:', error);
    res.status(500).send(new ErrorResponse('Failed to update organization', error));
  }
};

export const deleteOrganization = async (req: any, res: any) => {
  try {
    const organizationId = req.params.organizationId;

    if (!organizationId) {
      return res.status(400).send(new ErrorResponse('Organization ID is required.'));
    }

    const organization = await Organization.findByIdAndDelete(organizationId);
    if (!organization) {
      return res.status(404).send(new ErrorResponse('Organization not found.'));
    }

    res.status(200).send({ message: 'Organization deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting organization:', error);
    res.status(500).send(new ErrorResponse('Failed to delete organization', error));
  }
};
