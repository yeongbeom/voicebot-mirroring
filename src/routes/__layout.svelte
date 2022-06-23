<script lang="ts">
	import '$root/styles/global.css';

	import Transition from '$root/components/Transition.svelte';
</script>

<main>
	<Transition>
		<slot />
	</Transition>
</main>
