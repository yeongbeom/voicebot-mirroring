import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import util from 'util';
import { exec } from 'child_process';
import dotenv from 'dotenv';

import { Client } from 'yeelight-node';

dotenv.config();

const port = process.env.PORT || 3080;
const app: Express = express();
const server = createServer(app);
const execPromise = util.promisify(exec);
const smartLight = new Client();

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

let yeelight: any;
smartLight.bind((light: any) => {
	yeelight = light;
	console.debug(light);
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

	socket.on('startYeelight', async () => {
		yeelight.set_power('on');
		// yeelight.set_rgb(color);
		yeelight.get_prop('bright').then((data: any) => console.debug(data));
		// yeelight.set_power('off');
	});

	socket.on('setYeelight', (color: [number, number, number]) => {
		yeelight.set_rgb(color);
	});

	socket.on('endYeelight', () => {
		yeelight.get_prop('bright').then((data: any) => console.debug(data));
		yeelight.set_power('off');
		// setTimeout(() => {
		// 	yeelight.closeConnection();
		// }, 1000);
	});

	socket.on('disconnect', (socket) => {
		console.debug(`Socket disconnected (${client})`);
	});
});

server.listen(port, () => {
	console.debug(`⚡️[server]: Server is running at http://localhost:${port}`);
});
