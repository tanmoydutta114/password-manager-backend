import DOMPurify from 'dompurify';
import { Request, Response } from 'express';
import produce from 'immer';
import { JSDOM } from 'jsdom';
import { ApiUtility } from '../utils/ApiUtility';
import { sendErrorResponse } from '../utils/HttpError';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export class RouteUtility {
	static sanitizeObjFunc(obj: any) {
		if (obj === undefined || obj === null) {
			return obj;
		}
		if (typeof obj === 'string') {
			return purify.sanitize(obj);
		}
		if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				obj[i] = this.sanitizeObjFunc(obj[i]);
			}
			return obj;
		}
		return obj;
	}

	static sanitizeObjRecursively(obj: any) {
		if (obj === undefined || obj === null) {
			return obj;
		}
		return produce(obj, (draft: any) => RouteUtility.sanitizeObjFunc(draft));
	}

	static callableWrapper(fn: (req: Request, res: Response) => Promise<Response>) {
		return async (request: Request, response: Response) => {
			const requestId = ApiUtility.generateNanoId();
			try {
				// For output sanitization, need to recursively go through the body and sanitize the strings if any
				const oldSend = response.send;
				const oldJson = response.json;

				response.send = function (body: any) {
					if (Buffer.isBuffer(body ?? {})) {
						return oldSend.call(this, body);
					}
					const sanitizedBody = RouteUtility.sanitizeObjRecursively(body);
					const isJson = !!sanitizedBody && typeof sanitizedBody === 'object';
					if (isJson && !this.get('Content-Type')) {
						this.set('Content-Type', 'application/json');
					}
					return oldSend.call(this, isJson ? JSON.stringify(sanitizedBody) : sanitizedBody);
				};

				response.json = function (body: any) {
					const sanitizedBody = RouteUtility.sanitizeObjRecursively(body);
					return oldJson.call(this, sanitizedBody);
				};
				response.on('finish', () => {
					const logMessage = `Response: Status = ${response.statusCode}, Request ID = ${requestId}, Request URL = ${request.originalUrl}, Request Method = ${request.method}`;
					if (response.statusCode >= 400) {
						ApiUtility.logError(request, logMessage);
					} else {
						ApiUtility.logInfo(request, logMessage);
					}
				});
				await fn(request, response);
			} catch (err) {
				await sendErrorResponse(err, request, response);
			}
		};
	}


}
