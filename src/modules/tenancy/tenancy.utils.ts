import { tenantedDatasourceOptions } from 'src/config/tenants-orm.config';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function getTenantConnection(tenantId: string): Promise<Connection> {
  const _tenantId = tenantId.replaceAll('-', '_');
  const connectionName = `tenant_${_tenantId}`;
  const connectionManager = getConnectionManager();

  if (connectionManager.has(connectionName)) {
    const connection = connectionManager.get(connectionName);
    return Promise.resolve(
      connection.isConnected ? connection : connection.connect(),
    );
  }

  return createConnection({
    ...(tenantedDatasourceOptions as PostgresConnectionOptions),
    name: connectionName,
    schema: connectionName,
  });
}
