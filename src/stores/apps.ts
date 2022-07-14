import { writable } from 'svelte/store';

export const alarm = writable({
	set: false,
	ring: false,
	hour: 6,
	minute: 30,
	ampm: '오후'
});

export const currentTime = writable('0시 0분 0초 오후');
