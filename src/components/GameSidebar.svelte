<script lang="ts">
	export let isOwnMove: boolean;

	function handleRefresh() {
		alert('Not implemented');
	}

	function handleLeaveGame() {
		alert('Not implemented');
	}
</script>

<div class="flex lg:flex-col gap-2 items-center lg:items-start gap-x-4">
	<p class="text-base text-gray-500">{isOwnMove ? 'Your turn now!' : 'Waiting for opponent'}</p>
	<button class="button-secondary" on:click={handleLeaveGame}>Refresh</button>
	<button class="button-secondary" on:click={handleLeaveGame}>Leave Game</button>
</div>
