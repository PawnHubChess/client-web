<script lang="ts">
	import { goto } from '$app/navigation';
	import { playstate, client_id, reconnect_code } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import 'chessboard-element';

	onMount(async () => {
		//if (get(playstate) !== "playing") goto("/play");

		let board = document.querySelector('chess-board');
		board?.start();

		board?.addEventListener('drop', (e) => {
			// @ts-ignore
			const { source, target } = e.detail;
			console.log(`${source} -> ${target}`);
		});
	});
</script>

<div class="flex justify-center mt-8">
	<chess-board draggable-pieces style="width: 80vh" />
</div>

<p class="text-base text-gray-600 font-medium text-center">
	You're matched to another player. Your id is <span class="font-bold">{$client_id}</span>
</p>
<p class="text-base text-gray-500 font-medium text-center mt-4">
	Reconnect Code: {$reconnect_code}
</p>
