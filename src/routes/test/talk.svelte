<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { currentStatus, say, heard, currentExpression } from '$root/stores/bot';

	import Talk from '$root/components/Talk.svelte';

	onMount(() => {
		console.log('talk destroyed');
	});
	onDestroy(() => {
		console.log('talk destroyed');
	});
</script>

<Talk />

<div>TALK</div>
<div>-> {$heard}</div>
<div>-> {$currentStatus}</div>
<div>-> {$currentExpression}</div>
<div>-> {$say}</div>
