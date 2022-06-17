<script lang="ts">
	import { onMount } from 'svelte';

	import { fetchEmpathyData, fetchTtsData } from '$root/api/talk';

	const data = {
		base64Audio: 'sfsdfsafds',
		text: '나 오늘 슬퍼',
		uid: 'temp-uid'
	};

	onMount(() => {
		try {
			fetchTtsData('테스트').then((data) => {
				console.log(data);
			});
			fetchEmpathyData(data).then((data) => {
				console.log(data);
			});
		} catch (error) {
			console.log(error);
		}
	});
</script>
