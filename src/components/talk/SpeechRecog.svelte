<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { currentStatus, status } from '$root/stores/bot';

	import ErrorMessage from '$root/components/ErrorMessage.svelte';

	const dispatch = createEventDispatcher();
	let error = false;
	let message: string;
	let recognition: any = null;

	onMount(() => {
		console.debug('SpeechRecognition.svelte mounted');

		// @ts-ignore
		if (!(window.webkitSpeechRecognition || window.SpeechRecognition)) {
			error = true;
			message = 'Speech Recognition is Not Available!';
			throw new Error(message);
		}

		// @ts-ignore
		recognition = new webkitSpeechRecognition() || new SpeechRecognition();

		recognition.lang = 'ko-KR';
		recognition.interimResults = true;

		recognition.onstart = () => {
			console.debug(`Speech recognition started | ${$currentStatus}`);

			if ($currentStatus === $status.idle) {
				dispatch('speech-onstart-idle');
			} else {
				dispatch('speech-onstart-else');

				setTimeout(() => {
					recognition.stop();
				}, 200);
			}
		};

		recognition.onresult = (event: any) => {
			if ($currentStatus === $status.idle || $currentStatus === $status.listening) {
				dispatch('speech-onresult', event);
			}
		};

		recognition.onerror = () => {
			console.error('Speech Recognition Error');
		};

		recognition.onend = () => {
			console.debug(`Speech recognition ended | ${$currentStatus}`);
			dispatch('speech-onend');

			recognition.start();
		};

		recognition.start();
	});

	onDestroy(() => {
		console.debug('SpeechRecognition.svelte destroyed');
		if (recognition !== null) recognition.stop();
	});
</script>

<ErrorMessage {error}>{message}</ErrorMessage>
