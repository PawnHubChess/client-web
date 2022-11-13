<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Research</h1>

	<h3 class="mt-8 text-center text-3xl font-medium text-gray-600">Conversations about Chess</h3>

	<div class="mt-4 gap-2 sm:columns-2 lg:columns-3">
		{#each data.tweets as tweet}
			<div class="rounded-md bg-gray-50 p-4 mb-2">
				<p class="">{tweet.text}</p>
				<p>{JSON.stringify(tweet.author.name)}</p>
			</div>
		{/each}
	</div>
</main>
