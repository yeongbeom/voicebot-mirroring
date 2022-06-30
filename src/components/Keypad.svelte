<script lang="ts">
	// import { createEventDispatcher } from 'svelte';

	export let value = '';

	// const dispatch = createEventDispatcher();

	const select = (num: number) => () => {
		value += num;
		// dispatch('pin', num);
	};
	const clear = () => {
		value = '';
		// dispatch('clear', value);
	};
	const del = () => {
		value = value.slice(0, -1);
		// dispatch('del');
	};
</script>

<div class="keypad">
	<button on:click={select(1)}>1</button>
	<button on:click={select(2)}>2</button>
	<button on:click={select(3)}>3</button>
	<button on:click={select(4)}>4</button>
	<button on:click={select(5)}>5</button>
	<button on:click={select(6)}>6</button>
	<button on:click={select(7)}>7</button>
	<button on:click={select(8)}>8</button>
	<button on:click={select(9)}>9</button>

	<button disabled={!value} on:click={clear}>clear</button>
	<button on:click={select(0)}>0</button>
	<button disabled={!value} on:click={del}>del</button>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 8rem);
		grid-template-rows: repeat(4, 5rem);
	}
</style>
