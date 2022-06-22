import { goto } from '$app/navigation';

export const handleTransition = (gotoUrl: string) => {
	goto(gotoUrl);
};
