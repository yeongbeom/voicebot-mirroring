<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import Slider from '$root/components/Slider.svelte';

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

	export let mobile: string;

	const socket = startSocket();

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

<Slider on:change={handleChange} />

<a href="/apps">Apps</a>
