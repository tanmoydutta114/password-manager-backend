import { CommonApiResponse, IdWithName, ZSafeString } from '../common/CommonTypes';
import { z } from 'zod';

const ZWebsiteLink = z.string().url({ message: 'Invalid URL' });

export const ZStorePasswordRequest = z.object({
	websiteName: ZSafeString,
	websiteLink: ZWebsiteLink,
	websiteUserName: ZSafeString,
	websiteUserPassword: ZSafeString,
	websiteLogoLink: ZWebsiteLink.nullable().optional(),
	categoryId: z.string().nullable().optional()
});

export type StorePasswordRequest = z.infer<typeof ZStorePasswordRequest>;

export interface UserPassword {
	id: number;
	userId: string;
	websiteName: string;
	websiteLink: string;
	websiteUserName: string;
	websiteLogoLink?: string | null;
	categoryId?: number | null;
	isFavorite: boolean;
	isDeleted: boolean;
	createdOn: string;
	modifiedOn: string;
	createdBy?: IdWithName;
	modifiedBy?: IdWithName;
}
export interface UserPasswordSqlResponse {
	id: number;
	user_id: string;
	website_name: string;
	website_link: string;
	website_user_name: string;
	website_logo_link: string | null;
	created_on: string;
	created_by: string;
	modified_on: string;
	modified_by: string;
	category_id: string | null;
	is_favorite: boolean;
	is_deleted: boolean;
}

export interface UserPasswordResponseBase extends CommonApiResponse {
	userPassword?: UserPassword | null;
}
