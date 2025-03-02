import { ErrorResponse } from '../utils/error';
import Tenant from '../models/tenant.model';
import { v4 as uuidv4 } from 'uuid';

export const registerTenant = async (req: any, res: any) => {
    try {
        const { name, domain, organizationId } = req.body;

        if (!name || !domain || !organizationId) {
            return res.status(400).send(new ErrorResponse('Tenant name, domain, and organizationId are required.'));
        }

        const tenantId = uuidv4();
        const tenant = new Tenant({
            tenantId,
            name,
            domain,
            organizationId,
        });

        await tenant.save();

        res.status(201).send({ message: 'Tenant registered successfully', tenantId: tenant._id });
    } catch (error: any) {
        console.error('Tenant registration error:', error);
        res.status(500).send(new ErrorResponse('Failed to register tenant', error));
    }
};

export const getTenant = async (req: any, res: any) => {
    try {
        const tenantId = req.params.tenantId;
        if (!tenantId) {
            return res.status(400).send(new ErrorResponse('Tenant ID is required.'));
        }

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).send(new ErrorResponse('Tenant not found.'));
        }

        res.status(200).send(tenant);
    } catch (error: any) {
        console.error('Error fetching tenant:', error);
        res.status(500).send(new ErrorResponse('Failed to fetch tenant', error));
    }
};

export const updateTenant = async (req: any, res: any) => {
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

        res.status(200).send({ message: 'Tenant updated successfully', tenant });
    } catch (error: any) {
        console.error('Error updating tenant:', error);
        res.status(500).send(new ErrorResponse('Failed to update tenant', error));
    }
};


export const deleteTenant = async (req: any, res: any) => {
    try {
        const tenantId = req.params.tenantId;

        if (!tenantId) {
            return res.status(400).send(new ErrorResponse('Tenant ID is required.'));
        }

        const tenant = await Tenant.findByIdAndDelete(tenantId);
        if (!tenant) {
            return res.status(404).send(new ErrorResponse('Tenant not found.'));
        }

        res.status(200).send({ message: 'Tenant deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting tenant:', error);
        res.status(500).send(new ErrorResponse('Failed to delete tenant', error));
    }
};
