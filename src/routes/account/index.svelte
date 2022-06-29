<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		console.debug(`/account (SSR): ${session.user?.emergencyMobile}`);
		if (!session.user) {
			return {
				status: 302,
				redirect: '/apps'
			};
		}

		return {
			status: 200,
			props: {
				mobile: session.user.emergencyMobile
			}
		};
	};
</script>

<script lang="ts">
	export let mobile: string;
</script>

<h1>Protected</h1>

<p>Welcome {mobile}!</p>
