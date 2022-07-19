import { writable } from 'svelte/store';

export const socketStatus = writable('none');

export const yeelight = writable('off');
