<script lang="ts">
	let showKlugerSchachzug = false;
</script>

<main class="mb-8">
	<p class="mt-8 text-center text-lg italic text-gray-700">Once a Pawn a Time...</p>
	<h1 class="mt-4 text-center text-7xl font-black">Chess:<span class="bg-clip-text bg-gradient-to-tr from-fuchsia-400 via-indigo-500 to-indigo-800 text-transparent">E</span></h1>

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
			<!-- svelte-ignore a11y-click-events-have-key-events since this is just an image joke -->
			<img
				src="/image_robot.webp"
				alt="The Chess Robot"
				class="max-h-64 rounded-md lg:max-h-[unset] hover:cursor-pointer"
				on:click={() => {showKlugerSchachzug = true}} />
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

	{#if showKlugerSchachzug}
		<div
			class="modal fade fixed top-0 left-0 z-[100] flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-60"
			tabindex="-1"
			aria-labelledby="modalLabel"
			aria-modal="true"
			role="dialog">
			<div class="modal-dialog modal-dialog-centered relative max-w-[90vw]">
				<div
					class="modal-content relative flex flex-col items-center gap-6 rounded-md bg-white p-8 shadow-lg">
					<img src="https://preview.redd.it/4qtae5346ia31.jpg?width=960&crop=smart&auto=webp&s=bac2c036bebdef65c7a0ad2655d89dea9bf91220" alt="Kluger Schachzug" class="max-h-[50vh]" />
					<p class="text-base italic">"Smart Chess Train"</p>
					<button
						class="button-primary min-w-[12rem]"
						on:click={() => {
							showKlugerSchachzug = false;
						}}>I know, bro.</button>
				</div>
			</div>
		</div>
	{/if}
</main>
