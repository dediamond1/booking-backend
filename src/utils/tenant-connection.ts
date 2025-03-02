import mongoose from 'mongoose';
import { ITenant } from '../models/tenant.model';

// Cache for tenant database connections
const tenantConnections = new Map<string, mongoose.Connection>();

/**
 * Establishes or retrieves a cached connection to a tenant's database
 * @param databaseUrl - The connection string for the tenant's database
 * @returns Promise<mongoose.Connection>
 */
export const connectToTenantDatabase = async (databaseUrl: string): Promise<mongoose.Connection> => {
  // Check if we already have a cached connection
  if (tenantConnections.has(databaseUrl)) {
    const cachedConnection = tenantConnections.get(databaseUrl);
    if (cachedConnection && cachedConnection.readyState === 1) {
      return cachedConnection;
    }
  }

  try {
    // Create new connection
    const connection = mongoose.createConnection(databaseUrl, {
      bufferCommands: false, // Disable buffering
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });

    // Cache the connection
    tenantConnections.set(databaseUrl, connection);

    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to tenant database:', error);
    throw new Error('Failed to establish database connection');
  }
};

/**
 * Closes all tenant database connections
 */
export const closeAllTenantConnections = async () => {
  for (const [url, connection] of tenantConnections.entries()) {
    try {
      await connection.close();
      tenantConnections.delete(url);
    } catch (error) {
      console.error('Error closing tenant connection:', error);
    }
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeAllTenantConnections();
  process.exit(0);
});
