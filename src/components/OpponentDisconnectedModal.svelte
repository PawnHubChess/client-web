<script lang="ts">
	import { goto } from "$app/navigation";

	export let isOpen: boolean;

	function handleButtonClick() {
		// WebSocket should already be closed when this modal is displayed
		goto("/play");
	}
</script>

{#if isOpen}
	<div
		class="modal fade fixed top-0 left-0 z-[100] flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-60"
		tabindex="-1"
		aria-labelledby="modalLabel"
		aria-modal="true"
		role="dialog">
		<div class="modal-dialog modal-dialog-centered relative max-w-[90vw]">
			<div
				class="modal-content relative flex flex-col items-center gap-6 rounded-md bg-white p-8 shadow-lg">
				<h5 class="modal-header text-xl font-bold text-gray-800" aria-live="polite">You're the Winner!</h5>
				<p class="text-lg font-medium text-gray-600">
					The game has ended because your opponent has disconnected.
				</p>
				<button class="button-primary min-w-[12rem]" on:click={handleButtonClick}>Okay</button>
			</div>
		</div>
	</div>
{/if}
