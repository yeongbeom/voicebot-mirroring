<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session, props }) => {
		console.debug(`/apps (SSR): ${session.user?.emergencyMobile}`);

		if (session.user) {
			return {
				status: 302,
				props
			};
		}

		return { props };
	};
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { session } from '$app/stores';

	import { enhance } from '$root/actions/form';
	import { clickOutside } from '$root/actions/clickOutside';

	import ErrorMessage from '$root/components/ErrorMessage.svelte';
	import Keypad from '$root/components/Keypad.svelte';
	import SlidableSection from '$root/components/SlidableSection.svelte';

	let mobile: string | undefined;

	let focus = false;

	export let error: string;
	export let success = '';
	export let user: User;

	onMount(() => {
		console.debug('apps/index.svelte mounted');
		if ($session.user) mobile = $session.user.emergencyMobile;
	});

	onDestroy(() => {
		console.debug('apps/index.svelte destroyed');
	});
</script>

<svelte:head>
	<title>APP</title>
</svelte:head>

<div>{user?.emergencyMobile}</div>

<div>
	session: {$session.user?.emergencyMobile}
</div>

<div>
	<ErrorMessage error={Boolean(error)}>{error}</ErrorMessage>
</div>

<SlidableSection rightUrl="/">
	<form
		action="/apps"
		method="post"
		use:enhance={{
			result: async (response) => {
				const result = await response.json();
				error = result.error;
				success = result.success;
				user = result.user;
				if (mobile) $session.user = { emergencyMobile: mobile };
			}
		}}
	>
		<span> 010 </span>
		<span>
			<input
				type="text"
				name="mobile"
				aria-label="Emergency mobile"
				placeholder="비상연락망"
				minlength="7"
				maxlength="8"
				pattern="[0-9]+"
				required
				bind:value={mobile}
				use:clickOutside
				on:focus={() => (focus = true)}
				on:click_outside={() => (focus = false)}
			/>
		</span>
		{#if !$session.user}
			<span>
				<button>로그인</button>
			</span>
		{/if}
	</form>
	{#if $session.user}
		<a href="/auth/logout">Log out</a>
		<a href="/account">My account</a>
	{/if}
	<a href="/apps/therapy">Multimodal therapy</a>

	{#if focus}
		<div>
			<Keypad bind:value={mobile} />
		</div>
	{/if}
</SlidableSection>

<style>
	form {
		height: 50vh;
	}

	input:valid {
		border: 3px solid greenyellow;
	}
</style>
