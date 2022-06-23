<script lang="ts">
	import { fly } from 'svelte/transition';

	import { page } from '$app/stores';

	let path = $page.url.pathname;
</script>

{#key path}
	{#if path === '/'}
		<div in:fly={{ x: -800, duration: 250, delay: 300 }} out:fly={{ x: -800, duration: 250 }}>
			<slot />
		</div>
	{:else if path === '/apps'}
		<div in:fly={{ x: 800, duration: 250, delay: 300 }} out:fly={{ x: 800, duration: 250 }}>
			<slot />
		</div>
	{:else}
		<div in:fly={{ y: -480, duration: 250, delay: 300 }} out:fly={{ y: -480, duration: 250 }}>
			<slot />
		</div>
	{/if}
{/key}
