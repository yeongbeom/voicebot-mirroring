import { io, Socket } from 'socket.io-client';

export const startSocket = () => {
	const socket = io('http://localhost:3080');

	// socket.on('eventFromServer', (message) => {
	// 	console.debug(message);
	// });

	return socket;
};

export const endSocket = (socket: Socket) => {
	socket.disconnect();
};
