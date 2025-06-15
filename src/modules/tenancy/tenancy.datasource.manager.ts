import { LRUCache } from 'lru-cache';
import { MAX_TENANT_DATA_SOURCES } from 'src/config/orm.config';
import { DataSource } from 'typeorm';

class DatasourceManager {
  private readonly cache = new LRUCache<string, DataSource, unknown>({
    max: MAX_TENANT_DATA_SOURCES,
    dispose: async (source: DataSource) => {
      await source.destroy();
    },
  });

  public async getOrCreate(
    name: string,
    factory: () => Promise<DataSource>,
  ): Promise<DataSource> {
    const existing = this.cache.get(name);
    if (existing) {
      return existing;
    }
    const createdDataSource = await factory();
    this.cache.set(name, createdDataSource);
    return createdDataSource;
  }
}

export const datasourceManager = new DatasourceManager();
