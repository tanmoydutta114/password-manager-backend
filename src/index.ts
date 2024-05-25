import app from './route/app';

const server = app.listen(app.get('port'), () => {
	console.info('Password Manager Backend is running at port %d in %s mode', app.get('port'), app.get('env'));
	console.info('Press CTRL-C to stop\n');
});

export default server;
