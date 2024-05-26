import { Request, Response } from 'express';
import { InsertObject } from 'kysely';
import { DB } from '../../prisma/generated/types';
import { getSQLClient } from '../sql/Database';
import { ApiUtility } from '../utils/ApiUtility';
import { HttpStatusCode } from '../utils/HttpStatusCodes';
import { StorePasswordRequest, UserPassword, UserPasswordResponseBase, UserPasswordSqlResponse } from './UserPasswordTypes';

export class UserPasswordRepository {
	static async storePassword(userId: string, storePasswordRequest: StorePasswordRequest): Promise<UserPasswordResponseBase> {
		const sqlConnection = getSQLClient();
		const { websiteLink, websiteName, websiteUserName, websiteUserPassword, categoryId, websiteLogoLink } = storePasswordRequest;
		const now = ApiUtility.createDate();
		const response: UserPasswordResponseBase = {
			isSuccess: false
		};
		return await sqlConnection.transaction().execute(async sqlClient => {
			if (categoryId) {
				const categoryData = await sqlClient
					.selectFrom('categories')
					.where('id', '==', parseInt(categoryId))
					.select(['id as categoryId', 'name as categoryName'])
					.executeTakeFirst();
				if (!categoryData) {
					response.message = `Invalid category id`;
					return response;
				}
			}

			const userPassword: InsertObject<DB, 'user_passwords'> = {
				user_id: userId,
				website_name: websiteName,
				website_user_name: websiteUserName,
				website_user_password: websiteUserPassword,
				website_logo_link: websiteLogoLink,
				website_link: websiteLink,
				category_id: categoryId,
				created_by: userId,
				modified_by: userId,
				created_on: now,
				modified_on: now
			};

			try {
				const insertResponse = await sqlClient.insertInto('user_passwords').values(userPassword).returning('id').executeTakeFirst();
				if (!insertResponse) {
					response.message = `Error while storing user password `;
					return response;
				}
				const responseUserPassword = {
					...userPassword,
					id: insertResponse.id
				} as UserPasswordSqlResponse;
				response.isSuccess = true;
				response.message = `Password stored successfully.`;
				response.userPassword = this.processUserPasswordSqlType(responseUserPassword);
			} catch (error) {
				response.isSuccess = true;
				response.message = `Error occurred while storing.`;
			}
			return response;
		});
	}
	static async getPasswords(req: Request, res: Response) {
		const userId = parseInt(req.userId);
		return res.status(HttpStatusCode.NOT_IMPLEMENTED).send({});
	}
	static processUserPasswordSqlType(userPassword: UserPasswordSqlResponse) {
		const userPasswordData: UserPassword = {
			id: userPassword.id,
			userId: userPassword.user_id,
			websiteName: userPassword.website_name,
			websiteLink: userPassword.website_link,
			websiteUserName: userPassword.website_user_name,
			websiteLogoLink: userPassword.website_logo_link ?? null,
			categoryId: userPassword.category_id ? ApiUtility.convertStringToNumber(userPassword.category_id) : null,
			isFavorite: userPassword.is_favorite ?? false,
			isDeleted: userPassword.is_deleted ?? false,
			createdOn: userPassword.created_on,
			modifiedOn: userPassword.modified_on
		};
		return userPasswordData;
	}
}
