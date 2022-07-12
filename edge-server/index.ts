import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';

import { Client } from 'yeelight-node';

import { wait, toRgbValue } from './utils';

dotenv.config();

const execPromise = util.promisify(exec);
const app: Express = express();
const server = createServer(app);

let socket: Socket | null = null;

app.get('/:mode', (req: Request, res: Response) => {
	const mode = req.params.mode;

	if (yeelight) {
		const cfTest = [
			// duration (ms), mode, rgb, brightness
			[100, 1, toRgbValue(255, 0, 0), 100],
			[900, 7, toRgbValue(255, 255, 255), 100],
			[100, 1, toRgbValue(0, 255, 0), 100],
			[900, 7, toRgbValue(255, 255, 255), 100],
			[100, 1, toRgbValue(0, 0, 255), 100],
			[900, 7, toRgbValue(255, 255, 255), 100]
		];

		const cfFire = [
			[1800, 1, toRgbValue(255, 150, 240), 80],
			[960, 1, toRgbValue(255, 150, 200), 30],
			[1500, 1, toRgbValue(255, 150, 240), 70],
			[900, 1, toRgbValue(255, 150, 180), 60],
			[600, 1, toRgbValue(255, 150, 240), 50],
			[960, 1, toRgbValue(255, 150, 200), 10],
			[1500, 1, toRgbValue(255, 150, 240), 50],
			[900, 1, toRgbValue(255, 150, 180), 90]
		];

		const cfAnger = [
			[10000, 1, toRgbValue(255, 150, 180), 80],
			[8000, 1, toRgbValue(120, 255, 0), 80],
			[18000, 1, toRgbValue(0, 100, 0), 80],
			[10000, 1, toRgbValue(255, 130, 100), 80],
			[7000, 1, toRgbValue(255, 150, 180), 80],
			[11000, 1, toRgbValue(120, 255, 0), 80],
			[18000, 1, toRgbValue(0, 100, 0), 80],
			[6000, 1, toRgbValue(255, 130, 100), 80]
		];

		const cfHappy = [
			[1300, 1, toRgbValue(190, 20, 20), 80],
			[1700, 1, toRgbValue(200, 180, 0), 80],
			[1500, 1, toRgbValue(255, 130, 100), 80],
			[1900, 1, toRgbValue(120, 255, 0), 80],
			[1700, 1, toRgbValue(200, 10, 10), 80],
			[2100, 1, toRgbValue(200, 180, 0), 80],
			[1500, 1, toRgbValue(255, 130, 100), 80],
			[1900, 1, toRgbValue(120, 255, 0), 80]
		];

		const cfSad = [
			[2300, 1, toRgbValue(200, 180, 0), 80],
			[2800, 1, toRgbValue(255, 150, 240), 80],
			[2500, 1, toRgbValue(30, 30, 120), 80],
			[2100, 1, toRgbValue(120, 205, 50), 80],
			[2300, 1, toRgbValue(200, 180, 0), 80],
			[2800, 1, toRgbValue(255, 150, 240), 80],
			[2300, 1, toRgbValue(30, 30, 120), 80],
			[2800, 1, toRgbValue(120, 205, 50), 80]
		];

		const cfVigor = [
			[10000, 1, toRgbValue(70, 70, 230), 80],
			[8000, 1, toRgbValue(80, 80, 230), 80],
			[7000, 1, toRgbValue(60, 60, 230), 80],
			[18000, 1, toRgbValue(50, 50, 230), 80],
			[11000, 1, toRgbValue(80, 70, 230), 80],
			[9000, 1, toRgbValue(70, 60, 230), 80],
			[10000, 1, toRgbValue(50, 70, 230), 80]
		];

		const cfMed = [
			[8300, 1, toRgbValue(200, 100, 150), 80],
			[6300, 1, toRgbValue(120, 205, 30), 80],
			[5300, 1, toRgbValue(160, 30, 30), 80],
			[10300, 1, toRgbValue(200, 180, 0), 80],
			[10300, 1, toRgbValue(200, 100, 150), 80],
			[8300, 1, toRgbValue(120, 205, 30), 80],
			[6300, 1, toRgbValue(160, 30, 30), 80],
			[10300, 1, toRgbValue(200, 180, 0), 80]
		];

		yeelight.set_power('on');
		switch (mode) {
			case 'sample':
				yeelight.start_cf(0, 2, cfTest);
				break;
			case 'sample1':
				yeelight.start_cf(0, 2, cfAnger);
				break;
			case 'sample2':
				yeelight.start_cf(0, 2, cfFire);
				break;
			case 'sample3':
				yeelight.start_cf(0, 2, cfHappy);
				break;
			case 'sample4':
				yeelight.start_cf(0, 2, cfMed);
				break;
			case 'sample5':
				yeelight.start_cf(0, 2, cfSad);
				break;
			case 'sample6':
				yeelight.start_cf(0, 2, cfVigor);
				break;
			default:
				yeelight.set_power('off');
		}
	}

	const filepath = path.join(__dirname, 'media', `${mode}.mp4`);

	let stat;
	try {
		stat = fs.statSync(filepath);
	} catch (error) {
		console.debug(error);
		socket?.emit('media', error);
		return;
	}

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
		yeelight.set_power('on');
		console.debug('Yeelight has been connected');

		if (socket) {
			console.debug('Send Yeelight socket connection event');
			socket.emit('yeelight', { success: 'YeeLight connected', yeelight });
		}
	});
}, 2000);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

io.on('connection', (pSocket) => {
	socket = pSocket;
	const client = socket.id;
	console.debug(`Socket connected (${client})`);

	socket.emit('main', { success: 'Main socket connected', client });
	if (socket) {
		console.debug('Send Yeelight socket connection event');
		socket.emit('yeelight', { success: 'YeeLight connected', yeelight });
	}

	socket.on('volumeChange', async (command) => {
		const shellScript = path.resolve(__dirname, 'shell', 'volume.sh');
		const { stdout, stderr } = await execPromise(
			`sh ${shellScript} ${command.interface} ${command.volume}`
		);

		if (stderr) {
			socket!.emit('setVolume', { error: stderr });
			console.error(`stderr: ${stderr}`);
			return;
		}

		console.debug(`stdout: ${stdout}`);

		socket!.emit('setVolume', { success: stdout });
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

	socket.on('cfYeelight', (colorList: [][]) => {
		yeelight.start_cf(0, 2, colorList);
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
