import { Request, Response } from 'express';
import { UserController } from '../user/UserController';
import { UserRepository } from '../user/UserRepository';
import { ApiUtility } from '../utils/ApiUtility';
import { HttpStatusCode } from '../utils/HttpStatusCodes';

export class AuthenticationController {
	static async signUp(req: Request, res: Response) {
		return UserController.createUser(req, res);
	}
	static async logIn(req: Request, res: Response) {
		const userId = ApiUtility.convertStringToNumber(req.userId);
		const { isSuccess, message, user } = await UserRepository.getUser({ userId });
		// TODO : Have to send Access and Refresh token
		if (!isSuccess) {
			return res.status(HttpStatusCode.NOT_FOUND).send({ isSuccess, message });
		}
		return res.status(HttpStatusCode.OK).send({ isSuccess, message, user });
	}
}
