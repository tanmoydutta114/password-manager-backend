import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type access_tokens = {
	id: Generated<number>;
	user_id: string;
	access_token: string;
	refresh_token: string;
	created_on: Generated<Timestamp>;
	expires_on: Timestamp;
	revoked: Generated<boolean | null>;
};
export type categories = {
	id: Generated<number>;
	name: string;
	props: unknown | null;
	created_on: Generated<Timestamp>;
	created_by: string;
	modified_on: Generated<Timestamp>;
	modified_by: string;
};
export type test = {
	id: number;
};
export type user_passwords = {
	id: Generated<number>;
	user_id: string;
	website_name: string;
	website_user_name: string;
	website_user_password: string;
	website_logo_link: string | null;
	created_on: Generated<Timestamp>;
	created_by: string;
	modified_on: Generated<Timestamp>;
	modified_by: string;
	category_id: string | null;
	is_favorite: Generated<boolean | null>;
	is_deleted: Generated<boolean | null>;
};
export type users = {
	id: Generated<number>;
	email: string;
	contact_no: string | null;
	user_name: string;
	created_on: Generated<Timestamp>;
	password_hash: string;
};
export type DB = {
	access_tokens: access_tokens;
	categories: categories;
	test: test;
	user_passwords: user_passwords;
	users: users;
};
