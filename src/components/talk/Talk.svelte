<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	import ErrorMessage from '$root/components/ErrorMessage.svelte';

	import { fetchTtsData, fetchEmpathyData } from '$root/api/talk';

	import {
		currentStatus,
		currentExpression,
		isTalking,
		status,
		expression,
		heard,
		say
	} from '$root/stores/bot';

	import SpeechRecog from '$root/components/talk/SpeechRecog.svelte';
	import MediaRec from '$root/components/talk/MediaRec.svelte';
	import { reloadApp } from '$root/utils/reloadApp';
	// import { ttsApiKey } from '$root/api/keys';
	import mp3file from '$root/components/talk/mp3/announce.mp3';
	let error = false;
	let message: string;

	let hasMounted = false;

	let stream: any = null;
	let mediaRecorder: any = null;
	let audioSource: any;

	let command: string | null = null;
	let cmdResText: string;
	let cmdResEmotion: string;
	let continued = false;

	const DELAY_RELOAD = 1; // 1000 * 3;
	const WATCHDOG_LIMIT = 50; // 20;
	let watchdogTimer = 0;

	let exceeded_date = null;
	let key_number = 0;

	const setIdle = () => {
		$currentStatus = $status.idle;
	};

	const stopRunningApps = () => {
		if (mediaRecorder !== null) {
			console.debug(`${mediaRecorder} is being stopped`);
			mediaRecorder.stop();
			console.error('----- in stopRunningApps -----');
			console.error(mediaRecorder.state);
			console.error('----- ------------------ -----');
		}
		if (stream !== null) {
			stream
				.getTracks() // get all tracks from the MediaStream
				.forEach((track: any) => {
					console.debug(`${track} is being stopped`);
					track.stop();
				}); // stop each of them
		}
	};

	const startMediaRecorder = async () => {
		stopRunningApps();

		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);
		} catch (err) {
			error = true;
			message = err as string;
			throw new Error(message);
		}
	};

	const handleSpeechOnstartIdle = async () => {
		console.log(`handleSpeechOnstartIdle | ${mediaRecorder.state}`);

		watchdogTimer = 0;

		if (audioSource && audioSource.removeEventListenr) {
			audioSource.removeEventListenr('ended', setIdle);
		}

		try {
			mediaRecorder.start();
		} catch (error) {
			await startMediaRecorder();
			console.error(`MediaRecorder restarted due to error: ${error}`);
		}
	};
	const handleSpeechOnstartElse = () => {
		console.log(`handleSpeechOnstartElse | ${mediaRecorder.state}`);

		if (
			($currentStatus === $status.thinking || $currentStatus === $status.talking) &&
			watchdogTimer < WATCHDOG_LIMIT
		) {
			console.debug(`watchdogTimer: ${watchdogTimer} times`);
			watchdogTimer++;
		} else if (watchdogTimer >= WATCHDOG_LIMIT) {
			reloadApp(window, DELAY_RELOAD);
		}
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
			if (text.includes('테라피') || text.includes('날씨') || text.includes('알람')) {
				command = '/apps';
				cmdResText = '서비스 화면으로 안내합니다.';
				cmdResEmotion = $expression.neutral;
			} else if (text.includes('시계')) {
				command = '/apps/clock';
				cmdResText = '시계 화면으로 안내합니다.';
				cmdResEmotion = $expression.neutral;
			}

			if (text.includes('아파') && !continued) {
				command = 'emergency';
				cmdResText = '많이 아프세요?';
				cmdResEmotion = $expression.neutral;

				continued = true;
			} else if (text.includes('아파') && continued) {
				command = 'emergency';
				cmdResText = '응급상황이 탐지되어, 비상연락처로 연락하겠습니다.';
				cmdResEmotion = $expression.worry;

				continued = false;
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
		let audioData: ArrayBuffer;
		try {
			let empathyRes; // [TODO] connect to db

			if (!command) empathyRes = await fetchEmpathyData(empathyReq);
			if (
				exceeded_date !== new Date().toLocaleDateString() &&
				exceeded_date !== null &&
				new Date().getHours() > 10
			) {
				key_number = 0;
				exceeded_date = null;
			}

			while (exceeded_date === null) {
				console.error('exceeded_date is null!!!');
				try {
					do {
						// console.error(empathyRes.text);
						// const audioData: ArrayBuffer = await fetchTtsData(
						audioData = await fetchTtsData(command ? cmdResText : empathyRes.text, key_number);
					} while (audioData.byteLength > 0 != true);
					const audioCtx = new AudioContext();

					audioCtx.decodeAudioData(audioData, (buffer) => {
						audioSource = audioCtx.createBufferSource();
						audioSource.addEventListener('ended', setIdle);
						audioSource.buffer = buffer;
						audioSource.connect(audioCtx.destination);
						audioSource.start(0);
					});
					break;
				} catch (error) {
					console.error('fetchTtsData error: ' + error);
					key_number++;
					// console.error(key_number, ' / 3');
					if (key_number === 1) {
						exceeded_date = new Date().toLocaleDateString();
					}
				}
			}
			if (exceeded_date !== null) {
				console.error(exceeded_date);
				const myAudio = new Audio();
				myAudio.src = mp3file;
				myAudio.play();
			}

			console.error('key number is ', key_number);

			/* do {
				audioData = await fetchTtsData(command ? cmdResText : empathyRes.text);
			} while (audioData.byteLength > 0 != true); */

			//@ts-ignore
			$currentExpression = $expression[command ? cmdResEmotion : empathyRes.emotion];
			$say = command ? cmdResText : empathyRes.text;
			$currentStatus = $status.talking;
		} catch (error) {
			setIdle();
			console.error(`${error} (${$currentStatus})`);
		}
	};

	const onStatusChange = () => {
		$isTalking = false;

		switch ($currentStatus) {
			case $status.init: {
				$currentExpression = $expression.neutral;
				$currentStatus = $status.idle;
				$say = '연결 중...<br />잠시만 기다려주세요';
				break;
			}
			case $status.idle: {
				$currentExpression = $expression.neutral;

				if (command !== 'emergency' && command !== null) goto(command);
				if (!command) continued = false;
				command = null;

				break;
			}
			case $status.listening: {
				$currentExpression = $expression.listen;
				break;
			}
			case $status.thinking: {
				$currentExpression = $expression.think;
				break;
			}
			case $status.talking: {
				$isTalking = true;
				break;
			}
			default: {
				throw new Error('Invalid status change');
			}
		}
	};

	$: {
		$currentStatus;
		onStatusChange();
	}

	onMount(async () => {
		console.debug('Talk.svelte mounted');

		await startMediaRecorder();

		$currentStatus = $status.idle;
		$say = '안녕하세요';

		hasMounted = true;
	});

	onDestroy(async () => {
		await stopRunningApps();

		console.debug(`Talk.svelte destroyed`);
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

<!-- <div>
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
</div> -->
