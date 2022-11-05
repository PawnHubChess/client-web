<script>
	import { page } from "$app/stores";
</script>

<div class="image" style="background-image: url('https://http.cat/{$page.status}.jpg');">
	<h1>Error {$page.status}: {$page.error?.message}</h1>
</div>

<style>
	.image {
		position: fixed;
		top: 0;
		left: 0;
		background-position: center;
		background-repeat: repeat;
		height: 100vh;
		width: 100vw;
	}

	.image h1 {
		width: fit-content;
		padding: 2rem;
		color: rgba(255, 255, 255, 0.87);
		background-color: #b93030;
		margin-top: 50vh;
		margin-left: 50vw;
		transform: translateY(-50%) translateX(-50%);
	}
</style>
