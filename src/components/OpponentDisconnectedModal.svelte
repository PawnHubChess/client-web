<script lang="ts">
	import { goto } from "$app/navigation";
	import { connection } from "$lib/chess/WebSocketConnection";


	export let isOpen: boolean;

    function handleButtonClick() {
        // WebSocket should already be closed when this modal is displayed
        goto("/play");
    }

</script>

{#if isOpen}
	<div
		class="modal fade fixed bg-black bg-opacity-60 top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto flex justify-center items-center z-[100]"
		tabindex="-1"
		aria-labelledby="modalLabel"
		aria-modal="true"
		role="dialog"
	>
		<div class="modal-dialog modal-dialog-centered relative max-w-[90vw]">
			<div
				class="modal-content shadow-lg relative flex flex-col bg-white rounded-md items-center gap-6 p-8"
			>
				<h5 class="modal-header text-xl font-bold text-gray-800">You're the Winner!</h5>
				<p class="text-lg text-gray-600 font-medium">
					The game has ended because your opponent has disconnected.
				</p>
				<button class="button-primary min-w-[12rem]" on:click={handleButtonClick}>Okay</button>
			</div>
		</div>
	</div>
{/if}
