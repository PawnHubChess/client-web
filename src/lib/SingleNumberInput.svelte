<script lang="ts">
	export let nextFocus: string | undefined = undefined;
	export let id: string | undefined = undefined;

	function handleKeyPress(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Backspace') {
			if (target.placeholder === '') goToPreviousElement(target);
			else target.placeholder = '';
		}

		if (isNaN(Number(e.key))) return;
		const input = Number(e.key);
		if (input < 0 || input > 9) return;

		target.placeholder = input.toString();
		target.value = '';

		goToNextElement(target);
	}

	function goToNextElement(target: HTMLInputElement) {
		if (nextFocus) {
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

<div class="relative mt-1 rounded-md shadow-sm w-fit">
	<input
		{id}
		on:keyup={handleKeyPress}
		type="number"
		min="0"
		max="9"
		class="block text-center text-5xl text-black placeholder-gray-900 font-bold rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 w-[1.2em]"
		placeholder=""
	/>
</div>
