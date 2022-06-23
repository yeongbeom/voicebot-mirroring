<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	const deltaX = 300;
	const deltaY = 100;
	let startX: number;
	let startY: number;
	let direction: number;

	export let rightUrl: string | null = null;
	export let leftUrl: string | null = null;

	const handleMousedown = (event: any) => {
		startX = event.screenX;
		startY = event.screenY;
	};

	const handleMouseup = (event: any) => {
		const diffX = event.screenX - startX;
		const absDiffY = Math.abs(event.screenY - startY);

		if (diffX < -deltaX && absDiffY < deltaY) {
			direction = -1;
			if (rightUrl !== null) goto(rightUrl);
		} else if (diffX > deltaX && absDiffY < deltaY) {
			direction = 1;
			if (leftUrl !== null) goto(leftUrl);
		}
	};
</script>

<section
	on:mousedown={handleMousedown}
	on:mouseup={handleMouseup}
	in:fly={{ x: 800 * direction, duration: 250, delay: 300 }}
	out:fly={{ x: 800 * direction, duration: 250 }}
>
	<slot />
</section>
