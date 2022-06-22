<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import Talk from '$root/components/talk/Talk.svelte';

	onMount(() => {
		console.debug('index.svelte mounted');
	});

	onDestroy(() => {
		console.debug('index.svelte destroyed');
	});
</script>

<div>
	<Talk />
</div>

<h1>INDEX</h1>
