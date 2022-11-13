<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Research</h1>

	<h3 class="mt-8 text-center text-3xl font-medium text-gray-600">Conversations about Chess</h3>

	<div class="mt-4 mb-8 gap-2 sm:columns-2 lg:columns-3">
		{#each data.tweets as tweet}
			<a
				href="https://twitter.com/{tweet.author.username}/status/{tweet.id}"
				target="_blank"
				rel="noreferrer">
				<div
					class="mb-2 inline-block w-full rounded-md bg-gray-50 p-4 transition-all hover:bg-indigo-50">
					<div class="flex items-center gap-1">
						<img
							src={tweet.author.profile_image_url}
							class="h-4 w-4 rounded-full"
							alt="{tweet.author.name}'s profile picture" />
						<p class="text-base text-gray-600">{tweet.author.username}</p>
					</div>
					<p class="mt-2 text-base text-gray-800">{tweet.text}</p>
				</div>
			</a>
		{/each}
	</div>
</main>
