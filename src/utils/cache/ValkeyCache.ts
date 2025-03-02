import { createClient } from 'valkey';
import { ICache } from './ICache';
import logger from '../logger';
import { CacheConfig } from './CacheFactory';

export class ValkeyCache implements ICache {
  private client: ReturnType<typeof createClient>;
  private isConnected = false;
  private connectionPool: ReturnType<typeof createClient>[] = [];
  private maxRetries: number;
  private retryDelay: number;
  private poolSize: number;

  constructor(url: string, config: CacheConfig) {
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.poolSize = config.poolSize || 10;

    // Create initial connection pool
    this.client = this.createClient(url);
    this.setupEventListeners();
    
    // Initialize connection pool
    for (let i = 0; i < this.poolSize - 1; i++) {
      this.connectionPool.push(this.createClient(url));
    }
  }

  private createClient(url: string): ReturnType<typeof createClient> {
    const client = createClient({ url });
    client.on('error', (err: Error) => {
      logger.error('Valkey client error:', err);
    });
    return client;
  }

  private async getClient(): Promise<ReturnType<typeof createClient>> {
    if (this.connectionPool.length > 0) {
      return this.connectionPool.pop()!;
    }
    return this.client;
  }

  private async releaseClient(client: ReturnType<typeof createClient>): Promise<void> {
    if (this.connectionPool.length < this.poolSize) {
      this.connectionPool.push(client);
    } else {
      await client.quit();
    }
  }

  private setupEventListeners() {
    this.client.on('connect', () => {
      this.isConnected = true;
      logger.info('Valkey cache connected');
    });

    this.client.on('error', (err: Error) => {
      logger.error('Valkey cache error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Valkey cache disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnection();
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.ensureConnection();
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.ensureConnection();
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.client.exists(key);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    await this.ensureConnection();
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    await this.ensureConnection();
    return this.client.decr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.ensureConnection();
    await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    await this.ensureConnection();
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    await this.ensureConnection();
    return this.client.keys(pattern);
  }

  async flushAll(): Promise<void> {
    await this.ensureConnection();
    await this.client.flushAll();
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}
