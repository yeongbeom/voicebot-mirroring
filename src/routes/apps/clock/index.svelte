<script lang="ts">
	import SlidableSection from '$root/components/SlidableSection.svelte';

	import { currentTime } from '$root/stores/apps';
</script>

<SlidableSection rightUrl="/apps">
	<div>
		{$currentTime.slice(0, 6)}
		{$currentTime.slice(10, 14)}
	</div>
</SlidableSection>

<style>
	div {
		background-color: black;
		height: 100%;
		color: white;
		font-size: 80px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
