<script lang="ts">
	import '$root/styles/global.css';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import WatchTime from '$root/components/alarm/WatchTime.svelte';

	let idleTime = 0;
	let previous: string;
	const timerIncrement = () => {
		const current = $page.url.pathname;
		if (current !== previous) idleTime = 0;
		previous = current;

		if (current === '/apps') idleTime = idleTime + 1;
		else if (current === '/account') idleTime = idleTime + 1;

		console.debug(`Idle Time: ${idleTime} (max 20 minuites)`);

		if (idleTime > 19) {
			// 20 minutes

			idleTime = 0;

			if (current === '/apps') goto('/');
			else if (current === '/account') goto('/');
		}
	};

	const disableContextmenu = (event) => {
		event.preventDefault();
		console.debug('disableContextmenu event occurs');
	};

	const handleClick = () => {
		idleTime = 0;
		const clickAudio = new Audio('/click.mp3');
		clickAudio.play();
	};

	onMount(() => {
		console.debug('__layout.svelte mounted');

		window.addEventListener('contextmenu', disableContextmenu);

		const idleInterval = setInterval(timerIncrement, 60 * 1000);
	});
</script>

<main on:click={handleClick}>
	<slot />
</main>
<WatchTime />

<style>
</style>
