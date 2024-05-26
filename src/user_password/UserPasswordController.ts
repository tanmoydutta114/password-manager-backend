import { Request, Response } from 'express';
import { HttpStatusCode } from '../utils/HttpStatusCodes';
import { ApiUtility } from '../utils/ApiUtility';
import { UserPasswordRepository } from './UserPasswordRepository';
import { StorePasswordRequest } from './UserPasswordTypes';

export class UserPasswordController {
	static async storePassword(req: Request, res: Response) {
		const userId = req.userId;
		const storePasswordRequest: StorePasswordRequest = req.body;
		const { isSuccess, message, userPassword } = await UserPasswordRepository.storePassword(userId, storePasswordRequest);
		if (!isSuccess) {
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ isSuccess, message });
		}
		return res.status(HttpStatusCode.OK).send({ isSuccess, message, userPassword });
	}
	static async getPasswords(req: Request, res: Response) {
		const userId = ApiUtility.convertStringToNumber(req.userId);
		return res.status(HttpStatusCode.OK).send({});
	}
}
