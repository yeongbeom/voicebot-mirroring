<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { swipe, tap } from 'svelte-gestures';

	export let height = '100vh';
	let sign: number;

	export let leftUrl: string | null = null;
	export let rightUrl: string | null = null;

	const handler = (event: any) => {
		const direction = event.detail.direction;

		if (direction === 'left' && leftUrl !== null) {
			sign = -1;
			goto(leftUrl);
		} else if (direction === 'right' && rightUrl !== null) {
			sign = 1;
			goto(rightUrl);
		}

		if (direction === undefined) {
			if (leftUrl !== null && rightUrl === null) {
				sign = -1;
				goto(leftUrl);
			} else if (leftUrl === null && rightUrl !== null) {
				sign = 1;
				goto(rightUrl);
			}
		}

		console.log(`direction: ${direction}`);
	};
</script>

<section
	use:tap={{ timeframe: 300 }}
	on:tap={handler}
	use:swipe={{ timeframe: 300, minSwipeDistance: 60 }}
	on:swipe={handler}
	in:fly={{ x: 800 * sign, duration: 250, delay: 300 }}
	out:fly={{ x: 800 * sign, duration: 250 }}
	style="--height: {height}"
>
	<slot />
</section>

<style>
	section {
		height: var(--height);
	}
</style>
