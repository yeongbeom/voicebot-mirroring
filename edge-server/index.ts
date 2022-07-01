import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3080;
const app: Express = express();
const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

io.on('connection', (socket) => {
	socket.emit('eventFromServer', 'Hello, World 👋');
});

server.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
