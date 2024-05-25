import { Request } from 'express';
import { nanoid } from 'nanoid';
export interface IApiResponse {
	isSuccess: boolean;
	message: string;
	id?: string;
}

export class ApiUtility {
	static getIsTestMode(): boolean {
		return process.env.RUN_MODE === 'test';
	}

	static createDate(value?: Date | string | null) {
		if (!value) {
			return new Date();
		}

		if (value instanceof Date) {
			return new Date(value.getTime());
		}
		return new Date(value);
	}

	static generateNanoId(length?: number) {
		const idLength = length ?? 20;
		const generatedId = nanoid(idLength);
		return generatedId;
	}

	static logInfo(req: Request, message: string, ...otherProps) {
		if (otherProps?.length) {
			message = message + ` (Attached in jsonPayload: ${otherProps?.length})`;
		}
		const entry = Object.assign({
			severity: 'INFO',
			message,
			otherProps: otherProps?.length ? otherProps : null
		});
		// Serialize to a JSON string and output.
		console.log(JSON.stringify(entry));
	}

	static logError(req: Request, message: string, err?: Error | null, ...otherProps) {
		if (otherProps?.length) {
			message = message + ` (Attached in jsonPayload: ${otherProps?.length}, error: ${err ? 'Yes' : 'No'})`;
		}
		const entry = Object.assign({
			severity: 'ERROR',
			message,
			error: err?.stack ?? null,
			otherProps: otherProps?.length ? otherProps : null
		});
		// Serialize to a JSON string and output.
		console.log(JSON.stringify(entry));
	}
}
