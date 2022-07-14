<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { alarm, currentTime } from '$root/stores/apps';

	let audio: any;
	let interval: any;

	$: {
		if (!$alarm.set) {
			$alarm.ring = false;
			audio?.pause();
		}
	}

	$: if ($alarm.ring) audio?.play();

	onMount(() => {
		console.debug('WatchTime.svelte mounted');
		audio = new Audio('/ringtone.mp3');
		audio.loop = true;

		interval = setInterval(() => {
			console.debug('WatchTime.svelte');
			let date = new Date(),
				h = date.getHours(),
				m = date.getMinutes(),
				s = date.getSeconds(),
				currentAmpm = '오전';
			if (h >= 12) {
				h = h - 12;
				currentAmpm = '오후';
			}
			h = h == 0 ? (h = 12) : h;
			$currentTime = `${h}시 ${m}분 ${s}초 ${currentAmpm}`;

			if (
				$alarm.set &&
				!$alarm.ring &&
				$alarm.hour === h &&
				$alarm.minute === m &&
				$alarm.ampm === currentAmpm
			) {
				$alarm.ring = true;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
		audio?.pause();
		console.debug('WatchTime.svelte destroyed');
	});
</script>
