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
	import Button from '$root/components/shared/Button.svelte';
	import SettingSvg from '$root/components/shared/SettingSvg.svelte';
	import LogoutSvg from '$root/components/shared/LogoutSvg.svelte';

	let mobile: string | undefined;

	let focus = false;
	let active = false;

	export let error = '';
	export let success = '';

	if ($session.user) mobile = $session.user.emergencyMobile;

	$: {
		mobile;
		if (mobile?.length < 7) active = false;
		else if (mobile?.length >= 7 && mobile?.length <= 8) active = true;

		if (mobile?.length === 8) focus = false;
		else if (mobile?.length > 8) mobile = mobile?.substring(0, 8);
	}

	$: $session.user, (focus = false);

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
	<div class="grid-container">
		<div class="header">
			<span class="setting">
				<a href="/account">
					<SettingSvg />
				</a>
			</span>
			<form
				on:click={() => {
					if (!$session.user) focus = true;
				}}
				class:focus
				class:disabled={$session.user}
				action="/apps"
				method="post"
				id="user"
				use:enhance={{
					result: async (response) => {
						const result = await response.json();
						error = result.error;
						success = result.success;
						if (mobile) $session.user = { emergencyMobile: mobile };
					}
				}}
			>
				<span> 전화번호 010 </span>
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
						autocomplete="off"
						disabled={$session.user}
						bind:value={mobile}
						use:clickOutside
						on:focus={() => (focus = true)}
						on:click_outside={() => (focus = false)}
					/>
				</span>
			</form>

			{#if !$session.user}
				<span>
					<Button {active} type="submit" form="user">로그인</Button>
				</span>
			{:else}
				<span>
					<a href="/auth/logout"><LogoutSvg /></a>
				</span>
			{/if}
		</div>
		<div class="content__left">
			<a href="/apps/therapy">테라피</a>
		</div>
		<div class="content__rightup">날씨</div>
		<div class="content__rightdown">알람</div>
	</div>
	{#if focus}
		<div class="modal">
			<keypad class="keypad">
				<Keypad bind:value={mobile} />
			</keypad>
		</div>
	{/if}
</SlidableSection>

<style>
	:root {
		--grid-padding__top: 3.5rem;
		--grid-column__header: 14vh;
		--grid-row-gap: 1rem;
		--grid-column-gap: 1rem;

		--border-radius: 3rem;
	}

	.grid-container {
		height: 100%;
		padding: var(--grid-padding__top) 2.5rem;

		display: grid;
		column-gap: var(--grid-column-gap);
		row-gap: var(--grid-row-gap);
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: var(--grid-column__header) repeat(
				2,
				calc(43vh - var(--grid-row-gap) - var(--grid-padding__top))
			);

		border: 1px solid black;
	}

	.header {
		grid-row-start: 1;
		grid-row-end: 2;
		grid-column-start: 1;
		grid-column-end: 3;

		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: center;

		border: 3px solid darkgray;
		border-radius: var(--border-radius);
	}

	.header > form {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 4.8rem;

		border: 1px solid #d3d3d3;
		border-radius: 0.8rem;
	}

	.header > form.focus {
		border: 3px solid greenyellow;
	}

	.header > form.disabled {
		border: none;
	}

	.header input {
		font-size: var(--font-18);
		height: 3.2rem;
		width: 11.5rem;

		text-align: center;
		letter-spacing: 0.2rem;
		font-family: var(--font-serif);

		border: none;
	}

	.header input:disabled {
		color: var(--color-text-primary);
		background-color: transparent;
	}

	input::placeholder {
		color: gray;
	}

	.header input:focus {
		outline: none;
		caret-color: transparent;
	}

	.header > span,
	.header > span > a {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content__left {
		grid-row-start: 2;
		grid-row-end: 4;
		grid-column-start: 1;
		grid-column-end: 2;

		display: flex;
		justify-content: center;
		align-items: center;

		border: 3px solid darkgray;
		border-radius: var(--border-radius);
	}

	.content__rightup {
		display: flex;
		justify-content: center;
		align-items: center;

		border: 3px solid darkgray;
		border-radius: var(--border-radius);
	}

	.content__rightdown {
		display: flex;
		justify-content: center;
		align-items: center;

		border: 3px solid darkgray;
		border-radius: var(--border-radius);
	}

	.modal {
		position: fixed; /* Stay in place */
		z-index: 1; /* Sit on top */
		top: calc(var(--grid-padding__top) + var(--grid-column__header) + var(--grid-row-gap));
		width: 100%; /* Full width */
		height: calc(
			100% - var(--grid-padding__top) * 2 - var(--grid-column__header) - var(--grid-row-gap)
		);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.keypad {
		padding: 1rem;
		height: 90%;
		width: 60%;
		background-color: rgba(0, 0, 0, 0.01);
		border-radius: calc(var(--border-radius) / 2);
	}
</style>
