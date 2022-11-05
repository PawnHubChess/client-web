<script lang="ts">
	import { Diamonds } from 'svelte-loading-spinners';

	export let isOwnMove: boolean;

	function handleRefresh() {
		alert('Not implemented');
	}

	function handleLeaveGame() {
		alert('Not implemented');
	}
</script>

<div class="flex lg:flex-col gap-2 items-center lg:items-start gap-x-4">
	<p class="text-base text-gray-500" />
	<p
		class="text-base text-gray-600 font-medium flex justify-center items-center gap-2"
	>
		{isOwnMove ? 'Your Turn Now!' : "Opponent's Move"}
		{#if !isOwnMove}
			<Diamonds color="#4d5536" size="24" duration="2s" />
		{/if}
	</p>
	<button class="button-secondary" on:click={handleLeaveGame}>Refresh</button>
	<button class="button-secondary" on:click={handleLeaveGame}>Leave Game</button>
</div>
