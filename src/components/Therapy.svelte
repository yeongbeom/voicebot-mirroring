<script lang="ts">
	let therapyMode = 'sample';
</script>

<input type="text" bind:value={therapyMode} />
<a href="/apps/therapy/{therapyMode}">테라피</a>
