<script lang="ts">
	import { onDestroy } from 'svelte';

	import { startSocket, endSocket } from '$root/lib/edgeServer';
	import { character, debugMode, webrtcStream, monitoring } from '$root/stores/config';

	import Slider from '$root/components/shared/Slider.svelte';
	import Radio from '$root/components/shared/Radio.svelte';
	import Switch from '$root/components/shared/Switch.svelte';

	let developer = false;

	const characterOptions = [
		{
			value: 'male_kitty',
			label: '고양이1'
		},
		{
			value: 'female_kitty',
			label: '고양이2'
		},
		{
			value: 'sample',
			label: '스마일'
		}
	];

	const sexOptions = [
		{
			value: 'male',
			label: '남성'
		},
		{
			value: 'female',
			label: '여성'
		}
	];
	const ageOptions = [
		{
			value: true,
			label: '50대 이상'
		},
		{
			value: false,
			label: '50대 미만'
		}
	];

	const socket = startSocket();

	const handleChange = (event: CustomEvent<{ volume: number }>) => {
		const volume = event.detail;
		console.log(volume);

		socket.emit('volumeChange', volume);
	};

	onDestroy(() => {
		endSocket(socket);
	});
</script>

<div class="grid-container">
	<span>캐릭터</span>
	<Radio
		options={characterOptions}
		fontSize={16}
		flexDirection={'row'}
		legend=""
		bind:userSelected={$character}
	/>

	<span>사용자 성별</span>
	<Radio
		options={sexOptions}
		fontSize={16}
		flexDirection={'row'}
		legend=""
		bind:userSelected={$character}
	/>

	<span>사용자 나이</span>
	<Radio
		options={ageOptions}
		fontSize={16}
		flexDirection={'row'}
		legend=""
		bind:userSelected={$character}
	/>

	<span>볼륨</span>
	<Slider on:change={handleChange} />

	<span>와이파이</span>
	<span>정상 연결 상태</span>

	<span>버전</span>
	<span on:click={() => (developer = !developer)}> 최신 버전</span>

	<span style="visibility: {developer ? 'visible' : 'hidden'}">Developer</span>
	<div class="developer" style="visibility: {developer ? 'visible' : 'hidden'}">
		<Switch bind:value={$debugMode} label="Debug Mode" design="slider" />
		<Switch bind:value={$webrtcStream} label="WebRTC" design="slider" />
		<Switch bind:value={$monitoring} label="Monitoring" design="slider" />
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 42px;
		justify-items: center;
		padding-right: 40px;

		height: 100%;

		overflow: scroll;
	}
</style>
