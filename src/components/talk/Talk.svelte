<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import ErrorMessage from '$root/components/ErrorMessage.svelte';

	import { fetchTtsData, fetchEmpathyData } from '$root/api/talk';

	import {
		currentStatus,
		say,
		heard,
		status,
		currentExpression,
		expression
	} from '$root/stores/bot';

	import SpeechRecog from '$root/components/talk/SpeechRecog.svelte';
	import MediaRec from '$root/components/talk/MediaRec.svelte';

	let error = false;
	let message: string;

	let stream: any = null;
	let mediaRecorder: any = null;
	let audioSource: any;

	let hasMounted = false;

	const setIdle = () => {
		$currentStatus = $status.idle;
	};

	const handleSpeechOnstartIdle = () => {
		console.log(`handleSpeechOnstartIdle | ${mediaRecorder.state}`);
		if (audioSource && audioSource.removeEventListenr) {
			audioSource.removeEventListenr('ended', setIdle);
		}
		mediaRecorder.start();
	};
	const handleSpeechOnstartElse = () => {
		console.log(`handleSpeechOnstartElse | ${mediaRecorder.state}`);
	};
	const handleSpeechOnresult = (event: any) => {
		console.log(`handleSpeechOnresult | ${mediaRecorder.state}`);
		const { results } = event.detail;
		$currentStatus = $status.listening;
		const text = Array.from(results)
			.map((result: any) => result[0])
			.map((result) => result.transcript)
			.join('');

		if (results[0].isFinal) {
			if (text.includes('확인')) {
				console.log('확인?');
			}
			$say = text;
		}

		$heard = text;
	};
	const handleSpeechOnend = () => {
		console.log(`handleSpeechOnend | ${mediaRecorder.state}`);
		if ($currentStatus === $status.listening) $currentStatus = $status.thinking;
		if (mediaRecorder.state === 'recording') mediaRecorder.stop();
	};
	const handleRecordOnstop = async (event: any) => {
		console.log(`handleRecordOnstop | ${mediaRecorder.state}`);
		const audio = event.detail;
		const empathyReq = {
			audio,
			text: $heard,
			uid: 'temp-uid'
		};
		try {
			const empathyRes = await fetchEmpathyData(empathyReq); // [TODO] connect to db
			const audioData: ArrayBuffer = await fetchTtsData(empathyRes.text);

			const audioCtx = new AudioContext();

			audioCtx.decodeAudioData(audioData, (buffer) => {
				audioSource = audioCtx.createBufferSource();
				audioSource.addEventListener('ended', setIdle);
				audioSource.buffer = buffer;
				audioSource.connect(audioCtx.destination);
				audioSource.start(0);
			});

			$currentExpression = $expression[empathyRes.emotion];
			$say = empathyRes.text;
			$currentStatus = $status.talking;
		} catch (error) {
			$currentStatus = $status.idle;
			console.error(error);
			console.debug(`${$currentStatus}`);
		}
	};

	onMount(async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch (err) {
			error = true;
			message = err as string;
			throw new Error(message);
		}

		mediaRecorder = new MediaRecorder(stream);

		$currentStatus = $status.idle;
		$say = 'hi';

		hasMounted = true;
	});

	onDestroy(() => {
		if (mediaRecorder !== null) mediaRecorder.stop();
		if (stream !== null) {
			stream
				.getTracks() // get all tracks from the MediaStream
				.forEach((track: any) => {
					console.debug(`${track} is being stopped`);
					track.stop();
				}); // stop each of them
		}
	});
</script>

{#if hasMounted}
	<SpeechRecog
		on:speech-onstart-idle={handleSpeechOnstartIdle}
		on:speech-onstart-else={handleSpeechOnstartElse}
		on:speech-onresult={handleSpeechOnresult}
		on:speech-onend={handleSpeechOnend}
	/>
	<MediaRec {mediaRecorder} on:record-onstop={handleRecordOnstop} />
	<ErrorMessage {error}>{message}</ErrorMessage>
{/if}

<div>
	-> {$say}
</div>

<div>
	-> {$heard}
</div>

<div>
	-> {$currentExpression}
</div>
<div>
	-> {$currentStatus}
</div>
