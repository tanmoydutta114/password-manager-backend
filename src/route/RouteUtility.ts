import DOMPurify from 'dompurify';
import { NextFunction, Request, Response } from 'express';
import produce from 'immer';
import { JSDOM } from 'jsdom';
import { ApiUtility } from '../utils/ApiUtility';
import { HttpError, sendErrorResponse } from '../utils/HttpError';
import { CheckPermSchemaParams } from './RouteCommonType';
import { get, set } from 'lodash';
import { HttpStatusCode } from '../utils/HttpStatusCodes';

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
	static checkRequestSchema<T>(params: CheckPermSchemaParams) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				if (params.expectedProps) {
					if (params.expectedProps.body?.length) {
						for (const bodyProp of params.expectedProps.body) {
							if (get(req.body, bodyProp) === undefined) {
								throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Invalid request', {
									message: `${bodyProp} is missing from request body properties`
								});
							}
						}
					}
					if (params.expectedProps.params?.length) {
						for (const paramProp of params.expectedProps.params) {
							if (!get(req.params, paramProp)) {
								throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Invalid request', {
									message: `${paramProp} is missing from request url params`
								});
							}
						}
					}
					if (params.expectedProps?.query?.length) {
						for (const queryProp of params.expectedProps.query) {
							if (!get(req.query, queryProp)) {
								throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Invalid request', {
									message: `${queryProp} is missing from request url query`
								});
							}
						}
					}
				}

				if (params.zodValidation) {
					for (const validation of params.zodValidation) {
						const zodObject = validation.zodSchema;
						const obj = validation.bodyProp ? get(req.body, validation.bodyProp) : req.body;
						const result = zodObject.safeParse(obj);
						if (!result.success) {
							throw new HttpError(500, `System encountered an internal error. Please contact the technical support team.`, {
								message: `Failed to validate the request schema for ${
									validation.bodyProp ? `${validation.bodyProp} in req body` : 'req body'
								}`,
								objects: result.error.errors
							});
						} else {
							// Mutate the body props to remove unwanted parts of the schema such as any extra keys
							if (validation.bodyProp) {
								set(req.body, validation.bodyProp, result.data);
							} else {
								req.body = result.data;
							}
						}
					}
				}

				next();
			} catch (err) {
				sendErrorResponse(err, req, res);
			}
		};
	}
}
