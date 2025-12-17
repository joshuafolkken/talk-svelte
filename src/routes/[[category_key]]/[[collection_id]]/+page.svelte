<script lang="ts">
	import { page } from '$app/state'
	import AnimatedBackground from '$lib/components/backgrounds/AnimatedBackground.svelte'
	import ListScreen from '$lib/components/screens/ListScreen.svelte'
	import MenuScreen from '$lib/components/screens/MenuScreen.svelte'
	import PracticeScreen from '$lib/components/screens/PracticeScreen.svelte'
	import AppVersion from '$lib/components/ui/AppVersion.svelte'
	import { use_responsive_state } from '$lib/hooks/UseResponsive.svelte'
	import type { PageProps } from './$types'

	const { data }: PageProps = $props()

	const responsive = use_responsive_state()
	const should_show_list = $derived(page.params.category_key !== undefined)
	const should_show_practice = $derived(page.params.collection_id !== undefined)
</script>

<div class="relative min-h-screen overflow-hidden">
	<AnimatedBackground />
	<!-- <YoutubeBackground video_id={url_parameters.video_id} time={url_parameters.time} /> -->

	{#if responsive.is_ready}
		<div
			class="m-4 mx-auto max-w-sm transition-transform"
			style="transform: scale({responsive.scale}); transform-origin: top center;"
		>
			{#if should_show_practice && data.phrases_module !== undefined}
				<PracticeScreen phrases_module={data.phrases_module} />
			{:else if should_show_list && data.phrases_module !== undefined}
				<ListScreen phrases_module={data.phrases_module} />
			{:else}
				<MenuScreen />
			{/if}
			<div class="mt-4 flex justify-end">
				<AppVersion />
			</div>
		</div>
	{/if}
</div>
