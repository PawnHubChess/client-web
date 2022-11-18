<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Research</h1>

	<h2 class="mt-8 text-center text-3xl font-medium text-gray-600">Conversations about Chess</h2>

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

					{#if tweet.public_metrics.like_count > 0}
						<div class="flex items-center justify-end gap-1">
							<svg
								class="h-3.5 w-3.5 fill-gray-600"
								xmlns="http://www.w3.org/2000/svg"
								x="0px"
								y="0px"
								width="100%"
								height="100%"
								viewBox="0 0 24 24"
								aria-labelledby="likesIconTitle">
								<title id="likesIconTitle">Likes icon</title>
								<path
									d="M16.5,3C13.605,3,12,5.09,12,5.09S10.395,3,7.5,3C4.462,3,2,5.462,2,8.5C2,14,12,21,12,21s10-7,10-12.5 C22,5.462,19.538,3,16.5,3z M12,18.518C8.517,15.845,4,11.406,4,8.5C4,6.57,5.57,5,7.5,5C9.902,5,12,7.907,12,7.907S14.14,5,16.5,5 C18.43,5,20,6.57,20,8.5C20,11.406,15.483,15.845,12,18.518z" />
							</svg>
							<p class="text-base text-gray-600">{tweet.public_metrics.like_count}</p>
						</div>
					{/if}
				</div>
			</a>
		{/each}
	</div>
</main>
