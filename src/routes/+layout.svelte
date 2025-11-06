<script lang="ts">
	import '../app.css'
	import favicon from '$lib/assets/favicon.svg'
	import { APP } from '$lib/constants/app'
	import { url } from '$lib/utils/url'
	import { onMount } from 'svelte'

	let { children } = $props()

	onMount(() => {
		url.redirect()
	})
</script>

<svelte:head>
	<title>{APP.NAME}</title>
	<meta
		name="description"
		content="Listen to English and repeat! Challenge your listening and pronunciation skills in this interactive game."
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="min-h-screen">
	{@render children?.()}
</main>
