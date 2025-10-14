<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import type { Question } from '$lib/types/question'
	import IconButton from './IconButton.svelte'
	import { PauseIcon, PlayIcon } from './icons'
	import Section from './Section.svelte'
	import ToggleRevealButton from './ToggleRevealButton.svelte'

	interface Props {
		question: Question
		is_playing: boolean
		show_transcript: boolean
		show_translation: boolean
		on_play_audio: VoidCallback
		on_can_play_through: VoidCallback
		on_toggle_transcript: VoidCallback
		on_toggle_translation: VoidCallback
		on_audio_ended: VoidCallback
		audio_element: HTMLAudioElement | undefined
	}

	let {
		question,
		is_playing,
		show_transcript,
		show_translation,
		on_play_audio,
		on_can_play_through,
		on_toggle_transcript,
		on_toggle_translation,
		on_audio_ended,
		audio_element = $bindable(),
	}: Props = $props()
</script>

<Section heading="Listen">
	<audio
		bind:this={audio_element}
		src="/audio/{question.audio_uri}"
		onended={on_audio_ended}
		oncanplaythrough={on_can_play_through}
		aria-label="Question Audio"
	></audio>

	<IconButton onclick={on_play_audio} label={is_playing ? 'Pause' : 'Play'}>
		{#if is_playing}
			<PauseIcon />
		{:else}
			<PlayIcon />
		{/if}
	</IconButton>

	<div class="flex w-full flex-col items-center gap-4">
		<ToggleRevealButton
			revealed={show_transcript}
			label="Script"
			content={question.transcript}
			on_toggle={on_toggle_transcript}
		/>

		<ToggleRevealButton
			revealed={show_translation}
			label="Meaning"
			content={question.translation}
			on_toggle={on_toggle_translation}
		/>
	</div>
</Section>
