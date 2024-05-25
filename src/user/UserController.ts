import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import config from '../../credential.json';
import { PASSWORD_SALT } from '../common/CommonTypes';
import { ApiUtility } from '../utils/ApiUtility';
import { HttpStatusCode } from '../utils/HttpStatusCodes';
import { UserRepository } from './UserRepository';
import { CreateUserRequest } from './UserTypes';

export class UserController {
	static async getUsers(req: Request, res: Response) {
		const userId = parseInt(req.userId);
		const { isSuccess, message, user } = await UserRepository.getUser({ userId });
		if (!isSuccess) {
			return res.status(HttpStatusCode.NOT_FOUND).send({ isSuccess, message });
		}
		return res.status(HttpStatusCode.OK).send({ isSuccess, message, user });
	}
	static async createUser(req: Request, res: Response) {
		const userRequestBody: CreateUserRequest = req.body;
		const numSaltRounds = ApiUtility.getIsTestMode() ? process.env.NUM_SALT ?? PASSWORD_SALT : config.NUM_SALT;
		const userPasswordHash = await bcrypt.hash(userRequestBody.password, numSaltRounds);
		const { isSuccess, message, user } = await UserRepository.createUser({ ...userRequestBody, password: userPasswordHash });
		if (!isSuccess) {
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ isSuccess, message });
		}
		return res.status(HttpStatusCode.OK).send({ isSuccess, message, user });
	}
}
