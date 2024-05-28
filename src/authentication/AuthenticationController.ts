import { Request, Response } from 'express';
import { UserController } from '../user/UserController';
import { UserRepository } from '../user/UserRepository';
import { ApiUtility } from '../utils/ApiUtility';
import { HttpStatusCode } from '../utils/HttpStatusCodes';
import { AccessTokenService } from './AccessTokenService';
import config from '../../credential.json';
import { EXPIRE_AT } from '../common/CommonTypes';
import { AuthenticationRepository } from './AuthenticationRepository';

export class AuthenticationController {
	static async signUp(req: Request, res: Response) {
		return UserController.createUser(req, res);
	}
	static async logIn(req: Request, res: Response) {
		const userId = ApiUtility.convertStringToNumber(req.userId);
		const { isSuccess, message, user } = await UserRepository.getUser({ userId });
		if (!user) {
			return res.status(HttpStatusCode.NOT_FOUND).send({ isSuccess, message });
		}
		const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
		const refreshTokenSecret = config.REFRESH_TOKEN_SECRET;

		const accessToken = AccessTokenService.createServerToken({ tokenSecret: accessTokenSecret, userInfo: user, expireAt: EXPIRE_AT });
		const refreshToken = AccessTokenService.createServerToken({ tokenSecret: refreshTokenSecret, userInfo: user, expireAt: EXPIRE_AT });
		const response = await AuthenticationRepository.insertRefreshToken({ expireAt: EXPIRE_AT, refreshToken, userId: userId });
		if (!response.isSuccess) {
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ isSuccess, message: 'Error while sending token' });
		}
		return res.status(HttpStatusCode.OK).send({ isSuccess, message, user });
	}
}
