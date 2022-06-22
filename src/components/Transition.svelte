<script lang="ts">
	import { fly } from 'svelte/transition';

	export let url: URL;
</script>

{#key url}
	{#if url.pathname === '/'}
		<div in:fly={{ x: -800, duration: 250, delay: 300 }} out:fly={{ x: -800, duration: 250 }}>
			<slot />
		</div>
	{:else if url.pathname === '/apps'}
		<div in:fly={{ x: 800, duration: 250, delay: 300 }} out:fly={{ x: 800, duration: 250 }}>
			<slot />
		</div>
	{:else}
		<div in:fly={{ y: -480, duration: 250, delay: 300 }} out:fly={{ y: -480, duration: 250 }}>
			<slot />
		</div>
	{/if}
{/key}
