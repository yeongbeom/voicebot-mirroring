import { writable } from 'svelte/store';

export const debugMode = writable('off');
export const webrtcStream = writable('on');
export const monitoring = writable('off');
