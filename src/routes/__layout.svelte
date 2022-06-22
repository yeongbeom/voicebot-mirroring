<script lang="ts">
	import '$root/styles/global.css';

	import { page } from '$app/stores';

	import Transition from '$root/components/Transition.svelte';
</script>

<main>
	<Transition url={$page.url}>
		<slot />
	</Transition>
</main>
