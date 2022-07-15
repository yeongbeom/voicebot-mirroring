<script lang="ts">
	import '$root/styles/global.css';
	import { onMount } from 'svelte';

	import WatchTime from '$root/components/alarm/WatchTime.svelte';

	const disableContextmenu = (event) => {
		event.preventDefault();
		console.debug('disableContextmenu event occurs');
	};

	const handler = () => {
		const clickAudio = new Audio('/click.mp3');
		clickAudio.play();
	};

	onMount(() => {
		console.debug('__layout.svelte mounted');

		window.addEventListener('contextmenu', disableContextmenu);
	});
</script>

<main on:click={handler}>
	<slot />
</main>
<WatchTime />

<style>
</style>
