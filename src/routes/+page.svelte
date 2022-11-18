<script lang="ts">
	import Counter from "../lib/Counter.svelte";
</script>

<main>
	<h1 class="mt-8 text-center text-7xl font-bold">Once a Pawn a Time...</h1>

	<h2 class="mt-8 text-center text-3xl font-medium text-gray-600">
		Enjoyable remote chess for both parties.
	</h2>

	<div class="mt-8 grid gap-4 lg:grid-cols-project">
		<div class="rounded-md bg-gray-50 p-4">
			<p class="text-base">
				Due to the high amount of requests to explain the project, we decided to create a landing
				page, which also acts as the hub to use our services. This website informs people of
				interest, e.g. the CODE community, the MotionLab community, about the services and
				technological functionality of this project. Simultaniously, visitors can start remote chess
				games.
			</p>

			<p class="mt-2 text-base">
				The landing page serves as a project to demonstrate general knowledge of web-development,
				front-end technologies. The development requires a general understanding of HTML, CSS,
				JavaScript, and relational databases, as well as sketching a user friendly website.
			</p>
		</div>

		<div class="flex justify-center xl:ml-[-4rem]">
			<img src="/image_robot.png" alt="The Chess Robot" class="max-h-64 lg:max-h-[unset] rounded-md" />
		</div>

		<div />
	</div>

	<div class="flex flex-col items-center">
		<div class="mt-8">
			<a
				href="https://github.com/PawnHubChess/backend/wiki"
				rel="noreferrer"
				target="_blank"
				class="button-primary">
				See this project on the Learning Platform
			</a>
		</div>
		<div class="mt-5">
			<a
				href="https://github.com/PawnHubChess/backend/wiki"
				rel="noreferrer"
				target="_blank"
				class="button-secondary">
				Frontend on GitHub
			</a>
			<a
				href="https://github.com/PawnHubChess/backend/wiki"
				rel="noreferrer"
				target="_blank"
				class="button-secondary">
				Backend on GitHub
			</a>
		</div>
	</div>
</main>
