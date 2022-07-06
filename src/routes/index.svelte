<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { debugMode, webrtcStream } from '$root/stores/config';
	import SlidableSection from '$root/components/SlidableSection.svelte';
	import Talk from '$root/components/talk/Talk.svelte';
	import DefaultExpression from '$root/components/expressions/DefaultExpression.svelte';
	import SpeechBubble from '$root/components/expressions/SpeechBubble.svelte';
	import WebRtc from '$root/components/WebRtc.svelte';
	import TestExpression from '$root/components/expressions/TestExpression.svelte';
	import TestText from '$root/components/expressions/TestText.svelte';

	onMount(() => {
		console.debug('index.svelte mounted');
	});

	onDestroy(() => {
		console.debug('index.svelte destroyed');
	});
</script>

<svelte:head>
	<title>공감대화</title>
</svelte:head>

<div>
	<Talk />
</div>

<SlidableSection leftUrl="/apps">
	<div class="voicebot">
		<div class="expression">
			<DefaultExpression />
		</div>

		<div class="speech-bubble">
			<SpeechBubble />
		</div>
	</div>
</SlidableSection>
{#if $webrtcStream === 'on'}
	<WebRtc />
{/if}

{#if $debugMode === 'on'}
	<div>
		<TestExpression />
		<TestText />
	</div>
{/if}

<style>
	div.voicebot {
		display: grid;
		grid-template-columns: 1fr;
	}
	div.voicebot div {
		grid-row-start: 1;
		grid-column-start: 1;
	}
</style>
