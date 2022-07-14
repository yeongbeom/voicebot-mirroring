<script lang="ts">
	import { fade } from 'svelte/transition';

	import SocketManager from '$root/components/SocketManager.svelte';

	import SlidableSection from '$root/components/SlidableSection.svelte';

	export let mode: string;

	let ready: string;
</script>

<SocketManager bind:ready />

<SlidableSection pressUrl="/apps">
	{#if ready !== 'both'}
		<div class="load" out:fade>
			<img src="/loading.gif" alt="" />
			{#if ready === 'main'}
				<span>스마트조명 연결 중...</span>
			{:else}
				<span>장치 연결 중...</span>
			{/if}
		</div>
	{:else}
		<video src="http://localhost:3080/{mode}" autoplay>
			<track kind="captions" />
		</video>
	{/if}
</SlidableSection>

<style>
	.load {
		background-color: black;
		height: 100vh;
		width: 100vw;

		display: flex;
		gap: 32px;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: white;
		font-weight: 600;
	}
	.load > img {
		height: 120px;
	}

	video {
		height: 100vh;
		width: 100vw;
		background-color: black;
	}
</style>
