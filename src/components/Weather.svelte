<script lang="ts">
	import { onMount } from 'svelte';

	import { weatherApiKey } from '$root/api/keys';

	let weather: any;

	const getCurrentWeather = async (lat: number, lon: number) => {
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
		);

		if (!res.ok) {
			const { message } = await res.json();
			throw new Error(message);
		}

		return await res.json();
	};

	onMount(() => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		const success = async (pos) => {
			const crd = pos.coords;

			weather = await getCurrentWeather(crd.latitude, crd.longitude);
			console.log(weather);
			console.log(weather.name);
		};

		const error = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
	});
</script>

<div class="weather">
	<h1>{weather?.name}</h1>
	<div class="temp">51 °C</div>
	<img src="" alt="" class="icon" />
	<div class="description">흐림</div>
	<div class="humidity">습도: 60%</div>
</div>

<style>
	.weather {
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* align-items: center; */

		height: 100%;
	}
</style>
