import { CommonApiResponse } from '../common/CommonTypes';
import { z } from 'zod';

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);
const passwordSchema = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.max(20, { message: 'Password must be no more than 20 characters long' })
	.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
	.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
	.regex(/[0-9]/, { message: 'Password must contain at least one number' })
	.regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@$!%*?&)' });

export const ZCreateUserRequest = z.object({
	email: z.string().email(),
	contactNo: z.string().regex(phoneRegex, { message: 'Invalid Number!' }).nullable().optional(),
	userName: z
		.string()
		.min(5, { message: `User name should have min 5 characters` })
		.max(10, { message: 'User name must be no more than 10 characters long' }),
	password: passwordSchema
});

export type CreateUserRequest = z.infer<typeof ZCreateUserRequest>;

export interface User {
	email: string;
	contactNo?: string | null;
	userName: string;
	createdOn: Date;
	userId: number;
}

export interface UserResponseBase extends CommonApiResponse {
	user?: User | null;
}
