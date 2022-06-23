<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import SlidableSection from '$root/components/SlidableSection.svelte';

	import { handleTransition } from '$root/utils/handleTransition';

	onMount(() => {
		console.debug('apps/index.svelte mounted');
	});

	onDestroy(() => {
		console.debug('apps/index.svelte destroyed');
	});
</script>

<svelte:head>
	<title>APP</title>
</svelte:head>

<SlidableSection
	on:drag-right={() => {
		handleTransition('/');
	}}
>
	<div>
		<h1>Apps</h1>
	</div>
</SlidableSection>

<style>
	div {
		height: 100vh;
		background-color: gray;
	}
</style>
