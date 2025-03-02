import { ICache } from './ICache';
import { RedisCache } from './RedisCache';
import { ValkeyCache } from './ValkeyCache';
import logger from '../logger';

export interface CacheConfig {
  protocol: 'redis' | 'rediss';
  host: string;
  port: number;
  password?: string;
  database: number;
  maxRetries?: number;
  retryDelay?: number;
  poolSize?: number;
}

class CacheFactory {
  private static validateConfig(config: CacheConfig): void {
    if (config.database < 0 || config.database > 15) {
      throw new Error('Database number must be between 0 and 15');
    }
    if (config.port < 1 || config.port > 65535) {
      throw new Error('Invalid port number');
    }
    if (config.poolSize && (config.poolSize < 1 || config.poolSize > 100)) {
      throw new Error('Pool size must be between 1 and 100');
    }
  }

  private static getConfig(database: number): CacheConfig {
    const protocol = process.env.CACHE_TLS === 'true' ? 'rediss' : 'redis';
    const host = process.env.CACHE_HOST || 'localhost';
    const port = parseInt(process.env.CACHE_PORT || '6379');
    const password = process.env.CACHE_PASSWORD;
    const maxRetries = parseInt(process.env.CACHE_MAX_RETRIES || '3');
    const retryDelay = parseInt(process.env.CACHE_RETRY_DELAY || '1000');
    const poolSize = parseInt(process.env.CACHE_POOL_SIZE || '10');

    const config: CacheConfig = {
      protocol,
      host,
      port,
      password,
      database,
      maxRetries,
      retryDelay,
      poolSize
    };

    this.validateConfig(config);
    return config;
  }

  static createCache(database: number = 0): ICache {
    const config = this.getConfig(database);
    const provider = process.env.CACHE_PROVIDER || 'Redis';
    const url = `${config.protocol}://${config.password ? `:${config.password}@` : ''}${config.host}:${config.port}/${config.database}`;

    try {
      switch(provider) {
        case 'Redis':
          logger.info(`Using Redis cache provider with pool size ${config.poolSize}`);
          return new RedisCache(url, config);
        case 'Valkey':
          logger.info(`Using Valkey cache provider with pool size ${config.poolSize}`);
          return new ValkeyCache(url, config);
        default:
          throw new Error(`Unsupported cache provider: ${provider}`);
      }
    } catch (error) {
      logger.error(`Failed to create cache instance: ${error.message}`);
      throw new Error(`Cache initialization failed: ${error.message}`);
    }
  }
}

export default CacheFactory;
