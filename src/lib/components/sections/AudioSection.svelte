<script lang="ts">
	import ToggleRevealButton from '$lib/components/features/ToggleRevealButton.svelte'
	import { PauseIcon, PlayIcon } from '$lib/components/icons'
	import IconButton from '$lib/components/ui/IconButton.svelte'
	import Section from '$lib/components/ui/Section.svelte'
	import { ACTIONS } from '$lib/constants/actions'
	import { UI } from '$lib/constants/ui'
	import type { Phrase } from '$lib/data/phrases/phrases'
	import type { VoidCallback } from '$lib/types'

	interface Props {
		phrase: Phrase
		is_playing: boolean
		is_transcript_visible: boolean
		is_translation_visible: boolean
		on_play_audio: VoidCallback
		on_toggle_transcript: VoidCallback
		on_toggle_translation: VoidCallback
	}

	let {
		/* eslint-disable prefer-const -- props are not reassigned */
		phrase,
		is_playing,
		is_transcript_visible,
		is_translation_visible,
		on_play_audio,
		on_toggle_transcript,
		on_toggle_translation,
		/* eslint-enable prefer-const -- props are not reassigned */
	}: Props = $props()
</script>

<Section heading="Listen">
	<IconButton
		size={UI.BUTTON_SIZES.LG}
		onclick={on_play_audio}
		label={is_playing ? 'Pause' : 'Play'}
		data_action={ACTIONS.TOGGLE_PLAY}
	>
		{#if is_playing}
			<PauseIcon />
		{:else}
			<PlayIcon />
		{/if}
	</IconButton>

	<div class="flex w-full flex-col items-center gap-4">
		<ToggleRevealButton
			is_revealed={is_transcript_visible}
			label="Script"
			content={phrase.script}
			on_toggle={on_toggle_transcript}
			data_action={ACTIONS.TOGGLE_TRANSCRIPT}
		/>

		<ToggleRevealButton
			is_revealed={is_translation_visible}
			label="Meaning"
			content={phrase.translation}
			on_toggle={on_toggle_translation}
			data_action={ACTIONS.TOGGLE_TRANSLATION}
		/>
	</div>
</Section>
