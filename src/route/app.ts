import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { RouteUtility } from './RouteUtility';
import { UserController } from '../user/UserController';
import { ZCreateUserRequest } from '../user/UserTypes';

const app = express();

app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 8080);

app.post(
	'/user',
	RouteUtility.checkRequestSchema({ zodValidation: [{ bodyProp: 'user', zodSchema: ZCreateUserRequest }] }),
	RouteUtility.callableWrapper(UserController.createUser)
);

export default app;
