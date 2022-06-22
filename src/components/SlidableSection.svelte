<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const deltaX = 300;
	const deltaY = 100;
	let startX: number;
	let startY: number;

	const dispatch = createEventDispatcher();

	const handleMousedown = (event: any) => {
		startX = event.screenX;
		startY = event.screenY;
	};

	const handleMouseup = (event: any) => {
		const diffX = event.screenX - startX;
		const absDiffY = Math.abs(event.screenY - startY);

		if (diffX < -deltaX && absDiffY < deltaY) {
			dispatch('drag-left');
		} else if (diffX > deltaX && absDiffY < deltaY) {
			dispatch('drag-right');
		}
	};
</script>

<section on:mousedown={handleMousedown} on:mouseup={handleMouseup}>
	<slot />
</section>
