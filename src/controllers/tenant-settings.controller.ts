import { ErrorResponse } from '../utils/error';
import Tenant from '../models/tenant.model';

export const getTenantSettings = async (req: any, res: any) => {
  try {
    const tenantId = req.params.tenantId;
    if (!tenantId) {
      return res.status(400).send(new ErrorResponse('Tenant ID is required.'));
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).send(new ErrorResponse('Tenant not found.'));
    }

    const settings = {
      tenantTheme: tenant.tenantTheme,
      paymentGatewayConfig: tenant.paymentGatewayConfig,
      smtpConfig: tenant.smtpConfig,
      businessHours: tenant.businessHours,
      currency: tenant.currency,
      timezone: tenant.timezone,
    };

    res.status(200).send(settings);
  } catch (error: any) {
    console.error('Error fetching tenant settings:', error);
    res.status(500).send(new ErrorResponse('Failed to fetch tenant settings', error));
  }
};

export const updateTenantSettings = async (req: any, res: any) => {
  try {
    const tenantId = req.params.tenantId;
    const updateData = req.body;

    if (!tenantId) {
      return res.status(400).send(new ErrorResponse('Tenant ID is required.'));
    }

    const tenant = await Tenant.findByIdAndUpdate(tenantId, updateData, { new: true, runValidators: true });
    if (!tenant) {
      return res.status(404).send(new ErrorResponse('Tenant not found.'));
    }

    res.status(200).send({ message: 'Tenant settings updated successfully', tenant });
  } catch (error: any) {
    console.error('Error updating tenant settings:', error);
    res.status(500).send(new ErrorResponse('Failed to update tenant settings', error));
  }
};
