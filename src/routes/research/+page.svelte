<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Research</h1>

	<div>
		{#each data.tweets as tweet}
			<p>{JSON.stringify(tweet)}</p>
		{/each}
	</div>
</main>
