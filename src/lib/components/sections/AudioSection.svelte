<script lang="ts">
	import { asset } from '$app/paths'
	import ToggleRevealButton from '$lib/components/features/ToggleRevealButton.svelte'
	import { PauseIcon, PlayIcon } from '$lib/components/icons'
	import IconButton from '$lib/components/ui/IconButton.svelte'
	import Section from '$lib/components/ui/Section.svelte'
	import { AUDIO_PATH, BUTTON_SIZES } from '$lib/constants'
	import { ACTIONS } from '$lib/constants/actions'
	import type { Phrase } from '$lib/data/phrases/common'
	import type { VoidCallback } from '$lib/types'

	interface Props {
		phrase: Phrase
		is_playing: boolean
		is_transcript_visible: boolean
		is_translation_visible: boolean
		on_play_audio: VoidCallback
		on_can_play_through: VoidCallback
		on_toggle_transcript: VoidCallback
		on_toggle_translation: VoidCallback
		on_audio_ended: VoidCallback
		audio_element: HTMLAudioElement | undefined
	}

	let {
		phrase, // eslint-disable-line prefer-const
		is_playing, // eslint-disable-line prefer-const
		is_transcript_visible, // eslint-disable-line prefer-const
		is_translation_visible, // eslint-disable-line prefer-const
		on_play_audio, // eslint-disable-line prefer-const
		on_can_play_through, // eslint-disable-line prefer-const
		on_toggle_transcript, // eslint-disable-line prefer-const
		on_toggle_translation, // eslint-disable-line prefer-const
		on_audio_ended, // eslint-disable-line prefer-const
		audio_element = $bindable(),
	}: Props = $props()

	const audio_path = $derived(asset(`/${AUDIO_PATH}/${phrase.key}.mp3`))
</script>

<Section heading="Listen">
	<audio
		bind:this={audio_element}
		data-testid="phrase-audio"
		src={audio_path}
		onended={on_audio_ended}
		oncanplaythrough={on_can_play_through}
		aria-label="Question Audio"
	></audio>

	<IconButton
		size={BUTTON_SIZES.lg}
		onclick={on_play_audio}
		label={is_playing ? 'Pause' : 'Play'}
		data_action={ACTIONS.toggle_play}
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
			data_action={ACTIONS.toggle_transcript}
		/>

		<ToggleRevealButton
			is_revealed={is_translation_visible}
			label="Meaning"
			content={phrase.translation}
			on_toggle={on_toggle_translation}
			data_action={ACTIONS.toggle_translation}
		/>
	</div>
</Section>
