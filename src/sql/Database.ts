import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import config from '../../credential.json';
import { DB } from '../../prisma/generated/types';

let poolInstance: Pool;

const createPool = () => {
	return new Pool({
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_NAME,
		host: config.DB_HOST,
		max: 40,
		connectionTimeoutMillis: 3000,
		idleTimeoutMillis: 30000
	});
};

const getPoolInstance = () => {
	if (!poolInstance) {
		poolInstance = createPool();
	}
	return poolInstance;
};

const dialect = new PostgresDialect({
	pool: async () => getPoolInstance()
});

export function getSQLClient() {
	return new Kysely<DB>({
		dialect,
		plugins: [new CamelCasePlugin()]
	});
}
