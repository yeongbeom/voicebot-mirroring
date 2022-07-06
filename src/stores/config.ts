import { writable } from 'svelte/store';

export const debugMode = writable('off');
export const webrtcStream = writable('on');
