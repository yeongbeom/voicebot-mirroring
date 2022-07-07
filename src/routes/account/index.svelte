<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		console.debug(`/account (SSR): ${session.user?.emergencyMobile}`);
		if (!session.user) {
			return {
				status: 302,
				redirect: '/apps'
			};
		}

		return {
			status: 200,
			props: {
				mobile: session.user.emergencyMobile
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

<h1>Protected</h1>

<p>Welcome {mobile}!</p>

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
