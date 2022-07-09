<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		console.debug(`/account (SSR): ${session.user?.emergencyMobile}`);
		// if (!session.user) {
		// 	return {
		// 		status: 302,
		// 		redirect: '/apps'
		// 	};
		// }

		return {
			status: 200,
			props: {
				mobile: session.user?.emergencyMobile ?? '비회원'
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { startSocket, endSocket } from '$root/lib/edgeServer';
	import { character, debugMode, webrtcStream, monitoring } from '$root/stores/config';

	import Slider from '$root/components/shared/Slider.svelte';
	import Switch from '$root/components/shared/Switch.svelte';
	import Radio from '$root/components/shared/Radio.svelte';
	import BackSvg from '$root/components/shared/BackSvg.svelte';

	import Header from '$root/components/Header.svelte';

	export let mobile: string;

	const socket = startSocket();

	const characterOptions = [
		{
			value: 'male_kitty',
			label: '고양이1'
		},
		{
			value: 'female_kitty',
			label: '고양이2'
		},
		{
			value: 'sample',
			label: '스마일 (말풍선)'
		}
	];

	const handleChange = (event: CustomEvent<{ volume: number }>) => {
		const volume = event.detail;
		console.log(volume);

		socket.emit('volumeChange', volume);
	};

	onDestroy(() => {
		endSocket(socket);
	});
</script>

<div class="grid-container">
	<div class="header">
		<span> <BackSvg /> </span>
		<span style={'font-size: 32px'}> 설정 </span>
		<span>
			{#if mobile === '비회원'}
				{mobile}
			{:else if mobile.length === 7}
				010 {mobile.slice(0, 3)} {mobile.slice(3, 8)}
			{:else if mobile.length === 8}
				010 {mobile.slice(0, 4)} {mobile.slice(4, 9)}
			{/if}
		</span>
	</div>
	<div class="content">
		<Radio
			options={characterOptions}
			fontSize={16}
			legend="케릭터"
			bind:userSelected={$character}
		/>
		<Switch bind:value={$debugMode} label="Debug Mode" design="slider" />
		<Switch bind:value={$webrtcStream} label="WebRTC" design="slider" />
		<Switch bind:value={$monitoring} label="Monitoring" design="slider" />

		<Slider on:change={handleChange} />

		<a href="/apps">Apps</a>
	</div>
</div>

<style>
	:root {
		--grid-padding__top: 3.5rem;
		--grid-column__header: 14vh;
		--grid-row-gap: 1rem;
		--grid-column-gap: 1rem;

		--border-radius: 3rem;
	}

	.grid-container {
		height: 100%;
		padding: var(--grid-padding__top) 2.5rem;

		display: grid;
		column-gap: var(--grid-column-gap);
		row-gap: var(--grid-row-gap);
		grid-template-rows: var(--grid-column__header) calc(
				86vh - var(--grid-row-gap) - var(--grid-padding__top) * 2
			);
	}

	.header {
		border: 3px solid darkgray;
		border-radius: var(--border-radius);

		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-items: center;
		align-items: center;
	}

	.content {
		border: 3px solid darkgray;
		border-radius: var(--border-radius);
	}
</style>
