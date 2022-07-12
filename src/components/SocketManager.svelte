<script lang="ts">
	import { onDestroy } from 'svelte';

	import { startSocket, endSocket } from '$root/lib/edgeServer';

	import { connection, yeelight } from '$root/stores/socket';

	const socket = startSocket();

	export let volume: number | null = null;
	export let ready = '';
	export let debugMode = 'off';

	let error: string | null = null;

	const handleClick = (event) => {
		const message = event.target.innerText.split(':');
		let command = message[0];
		let valueList: Array<number> = new Array();

		if (message[1]) {
			const strValues = message[1].split(',');
			strValues.forEach((strValue: string) => {
				const num = parseInt(strValue);
				valueList.push(num);
			});
			socket.emit(command, valueList);
		} else socket.emit(command);
	};

	socket.on('main', (message) => {
		$connection.main = message;
	});

	socket.on('yeelight', (message) => {
		$connection.yeelight = message;
	});

	socket.on('media', (pError) => {
		error = pError.path;
	});

	socket.on('setVolume', (message) => {
		const { success, error } = message;

		if (success) console.debug(success);
		if (error) throw new Error(error);
	});

	$: {
		$connection;

		if ($connection.main && ($yeelight === 'off' || $connection.yeelight)) {
			ready = 'both';
		} else if ($connection.main) {
			ready = 'main';
		} else {
			ready = 'none';
		}
	}

	$: {
		volume;

		if (volume) {
			if (volume < 10) volume = 0;
			socket.emit('volumeChange', { interface: 'Master', volume });
		}
	}

	onDestroy(() => {
		endSocket(socket);

		$connection.main = '';
		if ($yeelight) $connection.yeelight = '';
	});
</script>

{#if error}
	No such file or directory: {error}
{/if}

{#if debugMode === 'on'}
	{#if ready === 'main'}
		<div>스마트조명 연결 중</div>
	{:else if ready === 'none'}
		<div>장치 연결 증</div>
	{/if}

	<div>
		<button on:click={handleClick}>startYeelight</button>
		<button on:click={handleClick}>setYeelight: 255, 0, 0</button>
		<button on:click={handleClick}>setYeelight: 0, 255, 0</button>
		<button on:click={handleClick}>endYeelight</button>
	</div>
{/if}

<style>
	div {
		text-align: center;
		background-color: darkgray;
	}
	button {
		width: 50%;
		height: 40px;
		margin: 16px;
	}
</style>
