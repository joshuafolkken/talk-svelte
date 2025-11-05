<script lang="ts">
	import YoutubeBackground from '$lib/components/backgrounds/YoutubeBackground.svelte'
	import MenuScreen from '$lib/components/screens/MenuScreen.svelte'
	import PracticeScreen from '$lib/components/screens/PracticeScreen.svelte'
	import AppVersion from '$lib/components/ui/AppVersion.svelte'
	import { use_page_state } from './UsePageState.svelte'

	const { audio, recording, ui, phrase, url_parameters, responsive, reset_all_states } =
		use_page_state()

	// URLパラメータでメニュー表示を制御
	const should_show_menu = $derived(
		url_parameters.collection === undefined || url_parameters.collection === '',
	)
</script>

<div class="relative min-h-screen overflow-hidden">
	<YoutubeBackground video_id={url_parameters.video_id} time={url_parameters.time} />

	{#if responsive.is_ready}
		<div
			class="m-4 mx-auto max-w-sm transition-transform"
			style="transform: scale({responsive.scale}); transform-origin: top center;"
		>
			{#if should_show_menu}
				<MenuScreen />
			{:else}
				<PracticeScreen {audio} {recording} {ui} {phrase} {url_parameters} {reset_all_states} />
			{/if}
			<div class="mt-4 flex justify-end">
				<AppVersion />
			</div>
		</div>
	{/if}
</div>
