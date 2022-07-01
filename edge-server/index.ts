import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import util from 'util';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3080;
const app: Express = express();
const server = createServer(app);
const execPromise = util.promisify(exec);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

io.on('connection', (socket) => {
	const client = socket.id;

	console.debug(`Socket connected (${client})`);

	// socket.emit('eventFromServer', 'Socket connected');

	socket.on('volumeChange', async (volume) => {
		const { stdout, stderr } = await execPromise('ls | grep js');
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		console.debug('stdout:', stdout);
	});

	socket.on('disconnect', (socket) => {
		console.debug(`Socket disconnected (${client})`);
	});
});

server.listen(port, () => {
	console.debug(`⚡️[server]: Server is running at http://localhost:${port}`);
});
