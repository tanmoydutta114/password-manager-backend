import { z } from 'zod';

export const ZSafeString = z.string().min(1);

export const PASSWORD_SALT = '1';

export interface CommonApiResponse {
	isSuccess: boolean;
	message?: string;
}

export interface IdWithName {
	id: string;
	name?: string | null;
}
