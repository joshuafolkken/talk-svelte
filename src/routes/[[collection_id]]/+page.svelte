<script lang="ts">
	import { page } from '$app/state'
	import AnimatedBackground from '$lib/components/backgrounds/AnimatedBackground.svelte'
	// import YoutubeBackground from '$lib/components/backgrounds/YoutubeBackground.svelte'
	import MenuScreen from '$lib/components/screens/MenuScreen.svelte'
	import PracticeScreen from '$lib/components/screens/PracticeScreen.svelte'
	import AppVersion from '$lib/components/ui/AppVersion.svelte'
	import { use_responsive_state } from '$lib/hooks/UseResponsive.svelte'

	const responsive = use_responsive_state()

	function is_collection_id_valid(): boolean {
		return page.params.collection_id === undefined || page.params.collection_id === ''
	}

	const should_show_menu = $derived(is_collection_id_valid())
</script>

<div class="relative min-h-screen overflow-hidden">
	<AnimatedBackground />
	<!-- <YoutubeBackground video_id={url_parameters.video_id} time={url_parameters.time} /> -->

	{#if responsive.is_ready}
		<div
			class="m-4 mx-auto max-w-sm transition-transform"
			style="transform: scale({responsive.scale}); transform-origin: top center;"
		>
			{#if should_show_menu}
				<MenuScreen />
			{:else}
				<PracticeScreen />
			{/if}
			<div class="mt-4 flex justify-end">
				<AppVersion />
			</div>
		</div>
	{/if}
</div>
