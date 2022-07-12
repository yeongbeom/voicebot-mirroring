<script lang="ts">
	import '$root/styles/global.css';
	import { onMount } from 'svelte';

	const disableContextmenu = (event) => {
		event.preventDefault();
		console.debug('disableContextmenu event occurs');
	};

	onMount(() => {
		console.debug('__layout.svelte mounted');

		window.addEventListener('contextmenu', disableContextmenu);
	});
</script>

<main>
	<slot />
</main>

<style>
</style>
