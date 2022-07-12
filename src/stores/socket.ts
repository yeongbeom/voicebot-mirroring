import { writable } from 'svelte/store';

export const connection = writable({
	main: '',
	yeelight: ''
});

export const yeelight = writable('on');
