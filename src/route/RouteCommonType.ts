import { ZodArray, ZodEffects, ZodObject, ZodRecord } from 'zod';

export interface CheckPermSchemaParams {
	expectedProps?: { body?: string[]; params?: string[]; query?: string[] } | null;
	zodValidation?: { bodyProp?: string; zodSchema: ZodObject<any, any> | ZodArray<any, any> | ZodRecord<any> | ZodEffects<any> }[];
}
