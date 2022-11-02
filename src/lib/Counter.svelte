<script lang="ts">
	import { tick } from 'svelte';
	import { ConfettiExplosion } from 'svelte-confetti-explosion';

	let count: number = 0;
	let confettiVisible = false;

	const increment = async () => {
		count += 1;
		if (count % 10 === 0) {
			confettiVisible = false;
			await tick();
			confettiVisible = true;
		}
	};
</script>

<button on:click={increment} class="mt-2 text-base text-center font-medium text-indigo-600 rounded-md bg-indigo-100 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-all">
	count is {count}
  {#if confettiVisible}
    <ConfettiExplosion particleCount={count} force={count >= 1000? 1 : count * 0.001} />
  {/if}
</button>
