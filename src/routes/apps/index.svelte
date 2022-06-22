<script lang="ts">
	import SlidableSection from '$root/components/SlidableSection.svelte';

	import { handleTransition } from '$root/utils/handleTransition';
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
