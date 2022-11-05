<script lang="ts">
	import { tick, time_ranges_to_array } from "svelte/internal";

	export let nextFocus: string | undefined = undefined;
	export let id: string | undefined = undefined;
	export let value: number | undefined;

	function handleKeyPress(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;

		if (e.key === "Backspace") {
			if (target.placeholder === "") goToPreviousElement(target);
			else value = undefined;
		}

		if (isNaN(Number(e.key))) return;
		const input = Number(e.key);
		if (input < 0 || input > 9) return;

		value = input;
		target.value = "";

		goToNextElement(target);
	}

	async function goToNextElement(target: HTMLInputElement) {
		if (nextFocus) {
			// Await the next tick in case the next element has to be enabled first
			await tick();
			(document.getElementById(nextFocus) as HTMLElement).focus();
			return;
		}

		const nextInput = target.parentElement!.nextElementSibling
			?.firstElementChild as HTMLInputElement;
		nextInput.focus();
	}

	function goToPreviousElement(target: HTMLInputElement) {
		const previousInput = target.parentElement!.previousElementSibling
			?.firstElementChild as HTMLInputElement;
		previousInput.focus();
	}
</script>

<div class="relative w-fit rounded-md shadow-sm">
	<input
		{id}
		on:keyup={handleKeyPress}
		type="number"
		min="0"
		max="9"
		class="block w-[1.2em] rounded-md border-gray-300 text-center text-5xl font-bold text-black placeholder-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
		placeholder={value?.toString() ?? ""} />
</div>
