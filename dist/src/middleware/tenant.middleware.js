"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTenantId = (req) => {
    // Implement logic to extract tenantId from request
    // Example: from a header
    const tenantId = req.headers['x-tenant-id'];
    return tenantId;
};
const tenantMiddleware = (req, res, next) => {
    const tenantId = getTenantId(req);
    if (!tenantId) {
        return res.status(400).send({ message: 'Tenant ID is required' });
    }
    // Make tenantId available to the request
    req.tenantId = tenantId;
    next();
};
exports.default = tenantMiddleware;
//# sourceMappingURL=tenant.middleware.js.map