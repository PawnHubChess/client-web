<script lang="ts">
	const teamMembers = [
		{
			name: 'Paul',
			image: '/team_pawn.webp',
			imageAlt: 'Pawn icon',
			href: 'https://www.linkedin.com/in/paul-bückhard-7b71a726a/',
			roles: ['Physical Interface', 'Board Client']
		},
		{
			name: 'Péter',
			image: '/team_bishop.webp',
			imageAlt: 'Bishop icon',
			href: 'https://www.linkedin.com/in/p%C3%A9ter-tam%C3%A1s-winkler-a61a05173/',
			roles: ['Phyical Interface', 'Robotics']
		},
		{
			name: 'Lennart',
			image: '/team_horse.webp',
			imageAlt: 'Bishop icon',
			href: 'https://www.linkedin.com/in/lennart-conrad-ywain-wennmachers-b8911b13b/',
			roles: ['Product Management']
		},
		{
			name: 'Noah',
			image: '/team_queen.webp',
			imageAlt: 'Queen icon',
			href: 'https://github.com/noah-frank/',
			roles: ['3d Design', 'Robotics']
		},
		{
			name: 'Florian',
			image: '/team_king.webp',
			imageAlt: 'King icon',
			href: 'https://www.linkedin.com/in/koenidv/',
			roles: ['Web Client', 'Backend', 'DevOps']
		},
		{
			name: 'Maximilian',
			image: '/team_rook.webp',
			imageAlt: 'Calculator icon',
			href: 'https://www.linkedin.com/in/arnold-max/',
			roles: ['Project Owner', 'Prototyping']
		},
		{
			name: 'Jorge',
			image: '/team_bishop.webp',
			imageAlt: 'Bishop icon',
			href: 'https://www.linkedin.com/in/jorge-peyroteo-guedes-69aa49167/',
			roles: ['Robotics', 'Physical Interface']
		}
	];
	const sortedTeamMembers = [...teamMembers].sort((a, b) => a.name.localeCompare(b.name));
</script>

<main class="mb-8">
	<h1 class="mt-8 text-center text-7xl font-bold">Meet the Team</h1>

	<div class="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
		{#each sortedTeamMembers as member}
			<a
				class="rounded-md bg-gray-50 pb-4 transition-all hover:bg-indigo-50"
				href={member.href}
				target="_blank"
				rel="noreferrer">
				<div class="flex flex-col items-center">
					<img src={member.image} alt={member.imageAlt} class="h-40 xl:h-48" />
					<p class="text-3xl font-bold">{member.name}</p>
					<ul class="pt-3 text-center">
						{#each member.roles as role}
							<li>{role}</li>
						{/each}
					</ul>
				</div>
			</a>
		{/each}
	</div>
</main>
