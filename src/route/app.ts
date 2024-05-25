import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { RouteUtility } from './RouteUtility';
import { UserController } from '../user/UserController';
import { ZCreateUserRequest } from '../user/UserTypes';

const app = express();
app.set('PORT', process.env.PORT || 8080);

app.use(cors());
app.set('port', process.env.PORT || 8080);

app.post(
	'/user',
	RouteUtility.checkRequestSchema({ zodValidation: [{ bodyProp: 'user', zodSchema: ZCreateUserRequest }] }),
	RouteUtility.callableWrapper(UserController.createUser)
);

export default app;
