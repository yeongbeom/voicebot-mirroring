<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { character, debugMode, webrtcStream } from '$root/stores/config';

	import SlidableSection from '$root/components/SlidableSection.svelte';
	import Talk from '$root/components/talk/Talk.svelte';
	import SampleExpression from '$root/components/expressions/SampleExpression.svelte';
	import MaleKittyExpression from '$root/components/expressions/MaleKittyExpression.svelte';
	import FemaleKittyExpression from '$root/components/expressions/FemaleKittyExpression.svelte';
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
	<title>Voicebot</title>
</svelte:head>

<Talk />

<SlidableSection leftUrl="/apps">
	<div class="voicebot">
		{#if $character === 'male_kitty'}
			<MaleKittyExpression />
		{:else if $character === 'female_kitty'}
			<FemaleKittyExpression />
		{:else if $character === 'sample'}
			<div class="expression">
				<SampleExpression />
			</div>
			<div class="speech-bubble">
				<SpeechBubble />
			</div>
		{/if}
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
