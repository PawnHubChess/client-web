<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
	console.log(data.tweets)
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Research</h1>

	<div>
		{#each data.tweets as tweet}
			<p class="mt-4">{tweet.text}</p>
			<p>{JSON.stringify(tweet.author.name)}</p>
		{/each}
	</div>
</main>
