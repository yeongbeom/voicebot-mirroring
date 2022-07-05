<script lang="ts">
	import { startSocket, endSocket } from '$root/lib/edgeServer';
	import { onDestroy } from 'svelte';

	const socket = startSocket();

	const handleClick = (event: PointerEvent) => {
		console.log(event.target.innerText);

		switch (Number(event.target.innerText)) {
			case 1:
				socket.emit('startYeelight');
				break;
			case 2:
				socket.emit('setYeelight', [255, 0, 0]);
				break;
			case 3:
				socket.emit('setYeelight', [0, 255, 0]);
				break;
			case 4:
				socket.emit('endYeelight');
				break;

			default:
				break;
		}
	};

	onDestroy(() => {
		endSocket(socket);
	});
</script>

<div>
	<video src="http://localhost:3080/video" controls />
</div>

<div>
	<button on:click={handleClick}>1</button>
	<button on:click={handleClick}>2</button>
	<button on:click={handleClick}>3</button>
	<button on:click={handleClick}>4</button>
</div>

<style>
	div {
		height: 100vh;
	}
	button {
		width: 100%;
		height: 20%;
	}
</style>
