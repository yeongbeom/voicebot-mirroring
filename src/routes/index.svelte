<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import Talk from '$root/components/talk/Talk.svelte';
	import SlidableSection from '$root/components/SlidableSection.svelte';

	onMount(() => {
		console.debug('index.svelte mounted');
	});

	onDestroy(() => {
		console.debug('index.svelte destroyed');
	});
</script>

<svelte:head>
	<title>INDEX</title>
</svelte:head>

<SlidableSection rightUrl="/apps">
	<div>
		<h1>INDEX</h1>
		<Talk />
	</div>
</SlidableSection>

<style>
	div {
		height: 100vw;
		background-color: green;
	}
</style>
