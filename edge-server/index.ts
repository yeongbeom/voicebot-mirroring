import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { Client } from 'yeelight-node';

import { wait } from './utils';

dotenv.config();

const execPromise = util.promisify(exec);
const app: Express = express();
const server = createServer(app);

app.get('/video', (req: Request, res: Response) => {
	const filepath = path.join(__dirname, 'media', 'sample.mp4');
	const stat = fs.statSync(filepath);
	const fileSize = stat.size;
	const range = req.headers.range;
	/*when we seek the video it will put
          range header to the request*/
	/*if range header exists send some
            part of video*/
	if (range) {
		//range format is "bytes=start-end",
		const parts = range.replace(/bytes=/, '').split('-');

		const start = parseInt(parts[0], 10);
		/*in some cases end may not exists, if its
                          not exists make it end of file*/
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		//chunk size is what the part of video we are sending.
		const chunksize = end - start + 1;
		/*we can provide offset values as options to
           the fs.createReadStream to read part of content*/
		const file = fs.createReadStream(filepath, { start, end });

		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		};
		/*we should set status code as 206 which is
                    for partial content*/
		// because video is continuously fetched part by part
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		//if not send the video from start.
		/* anyway html5 video player play content
          when sufficient frames available*/
		// It doesn't wait for the entire video to load.

		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4'
		};
		res.writeHead(200, head);
		fs.createReadStream(filepath).pipe(res);
	}
});
let yeelight: any = null;

const poll = async (fn: any, ms: number) => {
	fn();
	await wait(ms);

	while (yeelight === null) {
		fn();
		await wait(ms);
	}
};

poll(() => {
	const smartLight = new Client();
	console.debug('Finding Yeelight...');
	smartLight.bind((light: any) => {
		yeelight = light;
		console.debug('Yeelight has been connected');
	});
}, 2000);

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

	socket.on('volumeChange', async (command) => {
		const shellScript = path.resolve(__dirname, 'shell', 'volume.sh');
		const { stdout, stderr } = await execPromise(
			`sh ${shellScript} ${command.interface} ${command.volume}`
		);

		if (stderr) {
			socket.emit('setVolume', { error: stderr });
			console.error(`stderr: ${stderr}`);
			return;
		}

		console.debug(`stdout: ${stdout}`);

		if (socket != null) {
			socket.emit('setVolume', { success: stdout });
		}
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

const port = process.env.PORT || 3080;

server.listen(port, () => {
	console.debug(`⚡️[server]: Server is running at http://localhost:${port}`);
});
