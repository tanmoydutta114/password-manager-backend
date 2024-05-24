import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { get, set } from 'lodash';
import { RouteUtility } from './RouteUtility';

const app = express();

Sentry.init({
	dsn: serviceAccount.sentry_dsn,
	environment: ApiUtility.isDev() ? 'dev' : 'prod'
});

Sentry.setTag('decorum_backend', 'Backend E2');

const upload = multer({ storage: memoryStorage() });

app.use(
	express.urlencoded({
		extended: true
	})
);
app.use(
	express.json({
		type: 'application/json',
		limit: '1mb'
	})
);
app.use(express.raw({ inflate: true, limit: '1mb', type: 'text/xml' }));
// app.use(errorHandler());
app.use((req, res, next) => {
	// Add log correlation to nest all log messages beneath request log in Log Viewer.
	const traceHeader = req.header('X-Cloud-Trace-Context');
	const projectId = serviceAccount?.project_id;
	const globalLogFields = {};
	if (traceHeader && projectId) {
		const [trace] = traceHeader.split('/');
		globalLogFields['logging.googleapis.com/trace'] = `projects/${projectId}/traces/${trace}`;
	}
	req.globalLogFields = globalLogFields;
	Log.globalLogFields = globalLogFields;
	next();
});
app.use(cors());
app.set('port', process.env.PORT || 8080);

/*------------------------------------------------- CRM Api Start (18-04-2024) -----------------------------------*/

app.get(
	'/api/c/countries',
	RouteUtility.verifyAuth({}),
	checkPermissionAndReqSchema({}),
	RouteUtility.callableWrapper(())
);