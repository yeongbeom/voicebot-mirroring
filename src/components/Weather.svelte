<script lang="ts">
</script>

<div class="weather">
	<h1>서울 날씨</h1>
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
		background-color: #eaeaea;
		border-radius: calc(var(--border-radius) - 4px);
		padding: 32px;
	}
</style>
