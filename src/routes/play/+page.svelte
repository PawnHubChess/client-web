<script>
	import SingleNumberInput from '$lib/SingleNumberInput.svelte';
</script>

<div class="flex flex-col mt-16 items-center">
	<div class="flex flex-col gap-6 w-fit">
		<div class="flex justify-center items-center space-x-10">
			<div class="grid grid-cols-4 gap-4 w-fit">
				<SingleNumberInput id="input1" />
				<SingleNumberInput />
				<SingleNumberInput />
				<SingleNumberInput nextFocus="input2" />
			</div>
		</div>

		<div class="flex justify-center items-center space-x-10">
			<div class="grid grid-cols-4 gap-4 w-fit">
				<SingleNumberInput id="input2" />
				<SingleNumberInput />
				<SingleNumberInput />
				<SingleNumberInput nextFocus="connectButton" />
			</div>
		</div>

		<a id="connectButton" class="button-secondary mt-2" href="/play/create"> Connect </a>

		<div class="relative py-4">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="w-80 border-b border-gray-300" />
			</div>
			<div class="relative flex justify-center">
				<span class="bg-white px-4 text-sm text-gray-500">or</span>
			</div>
		</div>

		<a class="button-secondary" href="/play/create"> Start a New Game </a>

		<a
			class="text-base text-center font-medium text-gray-500 hover:text-gray-900 rounded-md"
			href="/play/debug">Debug Page</a
		>
	</div>
</div>
