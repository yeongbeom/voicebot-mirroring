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

	if ($session.user) mobile = $session.user.emergencyMobile;

	onMount(() => {
		console.debug('apps/index.svelte mounted');
	});

	onDestroy(() => {
		console.debug('apps/index.svelte destroyed');
	});
</script>

<svelte:head>
	<title>Applications</title>
</svelte:head>

<ErrorMessage error={Boolean(error)}>{error}</ErrorMessage>

<SlidableSection rightUrl="/">
	<nav>
		<form
			action="/apps"
			method="post"
			use:enhance={{
				result: async (response) => {
					const result = await response.json();
					error = result.error;
					success = result.success;
					if (mobile) $session.user = { emergencyMobile: mobile };
				}
			}}
		>
			<span>비상연락망</span>
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
	</nav>
	<div>
		<a href="/apps/therapy">Multimodal therapy</a>
	</div>
	<div>
		<section>section</section>
		<section>section</section>
	</div>
	{#if focus}
		<aside>
			<Keypad bind:value={mobile} />
		</aside>
	{/if}
</SlidableSection>

<style>
	nav {
		height: 10vh;
		display: flex;
		background-color: green;
	}

	div {
		height: 10vh;
		background-color: gray;
	}

	section {
		background-color: blue;
	}

	aside {
		background-color: black;
	}

	nav > form {
		height: 50vh;
	}

	nav input:valid {
		border: 3px solid greenyellow;
	}
</style>
