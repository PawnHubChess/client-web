<script lang="ts">
	import { goto } from '$app/navigation';
	import { playstate } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

    onMount(async () => {
        if (get(playstate) !== 'playing') goto('/play');
    })
</script>

If you're seeing this page, you're probably matched to another player.
