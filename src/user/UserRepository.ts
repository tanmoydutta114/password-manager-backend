import { InsertObject } from 'kysely';
import { DB } from '../../prisma/generated/types';
import { getSQLClient } from '../sql/Database';
import { ApiUtility } from '../utils/ApiUtility';
import { Log } from '../utils/Log';
import { CreateUserRequest, UserResponseBase } from './UserTypes';

export class UserRepository {
	static async getUser(params: { userId: number }) {
		const { userId } = params;
		const response: UserResponseBase = {
			isSuccess: false
		};
		const sqlConnection = getSQLClient();
		try {
			const user = await sqlConnection
				.selectFrom('users')
				.where('id', '==', userId)
				.select(['id as userId', 'contact_no as contactNo', 'created_on as createdOn', 'email', 'user_name as userName'])
				.executeTakeFirst();
			response.isSuccess = true;
			response.user = user;
		} catch (error) {
			Log.e(`Get user error : `, error);
			response.message = `Error occurred while fetching user or user not found. `;
		}
		return response;
	}

	static async createUser(userInformation: CreateUserRequest) {
		const { email, password, userName, contactNo } = userInformation;
		const sqlConnection = getSQLClient();
		const now = ApiUtility.createDate();
		const response: UserResponseBase = {
			isSuccess: false,
			user: null
		};

		const userSqlData: InsertObject<DB, 'users'> = {
			email,
			password_hash: password,
			contact_no: contactNo,
			user_name: userName,
			created_on: now
		};
		try {
			const user = await sqlConnection
				.insertInto('users')
				.values(userSqlData)
				.returning(['id as userId', 'contact_no as contactNo', 'created_on as createdOn', 'email', 'user_name as userName'])
				.executeTakeFirst();
			response.isSuccess = true;
			response.message = `User inserted successfully!`;
			response.user = user;
		} catch (error) {
			Log.e(`Create user error : `, error);
			response.message = `Error occurred while creating an user. `;
		}
		return response;
	}
}
