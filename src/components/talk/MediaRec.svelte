<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { currentStatus, status } from '$root/stores/bot';

	const dispatch = createEventDispatcher();

	export let mediaRecorder: any;

	onMount(() => {
		console.debug('MediaRecorder.svelte mounted');

		let chunks: any[] = [];

		mediaRecorder.ondataavailable = (event: any) => {
			chunks.push(event.data);
		};

		mediaRecorder.onstop = () => {
			console.debug(`Media recorder ended | ${$currentStatus}`);

			if ($currentStatus === $status.thinking) {
				const blob = new Blob(chunks, {
					type: 'audio/webm; codecs=opus'
				});

				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = async () => {
					const audio = reader.result as string;
					dispatch('record-onstop', audio);
				};
			}
			chunks = [];
		};

		mediaRecorder.onerror = (event: MediaRecorderErrorEvent) => {
			if (mediaRecorder.state === 'paused') {
				mediaRecorder.resume();
				console.debug('MediaRecorder is resumed');
			}
			throw new Error(event.error.message);
		};
	});

	onDestroy(() => {
		console.debug('MediaRecorder.svelte destroyed');
	});
</script>
