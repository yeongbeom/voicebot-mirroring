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

<div>
	<Talk />
</div>

<SlidableSection leftUrl="/apps">
	<div class="index">
		<h1>INDEX</h1>
	</div>
</SlidableSection>

<style>
	.index {
		height: 100vh;
		background-color: green;
	}
</style>
