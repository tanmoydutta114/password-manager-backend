import { InsertObject, Kysely } from 'kysely';
import { DB } from '../../prisma/generated/types';
import { CommonApiResponse } from '../common/CommonTypes';
import { getSQLClient } from '../sql/Database';
import { Log } from '../utils/Log';

export class AuthenticationRepository {
	static async insertRefreshToken(params: { refreshToken: string; userId: number; expireAt: string; sqlClient?: Kysely<DB> }) {
		const { expireAt, refreshToken, userId, sqlClient } = params;
		const sqlConnector = sqlClient ?? getSQLClient();
		const response: CommonApiResponse = {
			isSuccess: false
		};
		const tokenInformation: InsertObject<DB, 'access_tokens'> = {
			expires_on: expireAt,
			refresh_token: refreshToken,
			user_id: userId.toString()
		};
		try {
			await sqlConnector.insertInto('access_tokens').values(tokenInformation).execute();
			response.isSuccess = true;
		} catch (error) {
			Log.e(`Insert Refresh Token: Can't able to insert data.`, error);
		}
		return response;
	}
}
