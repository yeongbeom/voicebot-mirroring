<script lang="ts">
	import SlidableSection from '$root/components/SlidableSection.svelte';
	import { onDestroy } from 'svelte';

	let current = new Date();

	const interval = setInterval(() => {
		current = new Date();
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<SlidableSection rightUrl="/apps">
	<div>
		{current.toLocaleTimeString()}
	</div>
</SlidableSection>

<style>
	div {
		background-color: black;
		height: 100%;
		color: white;
		font-size: var(--font-80);

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
