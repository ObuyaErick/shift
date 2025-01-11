import { tenantedDatasourceOptions } from 'src/tenants-orm.config';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function getTenantConnection(tenantId: string): Promise<Connection> {
  const connectionName = `tenant_${tenantId}`;
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
