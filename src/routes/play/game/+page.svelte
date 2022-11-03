<script lang="ts">
	import { goto } from '$app/navigation';
	import { playstate, client_id, reconnect_code } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	onMount(async () => {
		if (get(playstate) !== 'playing') goto('/play');
	});
</script>

<p class="text-base text-gray-600 font-medium text-center mt-12">
	You're matched to another player. Your id is <span class="font-bold">{$client_id}</span>
</p>
<p class="text-base text-gray-500 font-medium text-center mt-4">Reconnect Code: {$reconnect_code}</p>
