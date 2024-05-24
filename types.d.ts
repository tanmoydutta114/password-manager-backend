declare namespace Express {
	export interface Request {
		uid: string;
		email: string;
		customClaims?: any;
		globalLogFields?: { [key: string]: string };
	}
}
