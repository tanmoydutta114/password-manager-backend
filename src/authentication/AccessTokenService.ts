import * as jwt from 'jsonwebtoken';
import { User } from '../user/UserTypes';
export class AccessTokenService {
	/*
        Creating Access and Refresh token
    */
	static createServerToken(params: { userInfo: User; tokenSecret: string; expireAt?: string }): string {
		const { tokenSecret, userInfo, expireAt } = params;
		const finalExpireAt = expireAt ?? '15s';
		const jwtToken = jwt.sign(userInfo, tokenSecret, { expiresIn: finalExpireAt });
		return jwtToken;
	}
}
