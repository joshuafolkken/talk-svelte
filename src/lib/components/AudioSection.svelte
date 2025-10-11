<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import type { Question } from '$lib/types/question'
	import ToggleRevealButton from './ToggleRevealButton.svelte'

	interface Props {
		question: Question
		is_playing: boolean
		show_transcript: boolean
		show_translation: boolean
		on_play_audio: VoidCallback
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
		on_toggle_transcript,
		on_toggle_translation,
		on_audio_ended,
		audio_element = $bindable(),
	}: Props = $props()
</script>

<div class="border-b border-white/25 p-12">
	<div class="flex flex-col items-center gap-8">
		<h2 class="section-header">Listen</h2>
		<button onclick={on_play_audio} class="btn-icon-glass h-20 w-20">
			<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				{#if is_playing}
					<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
				{:else}
					<path d="M8 5v14l11-7z" />
				{/if}
			</svg>
		</button>

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
	</div>
	<audio bind:this={audio_element} src="/audio/{question.audio_uri}" onended={on_audio_ended}
	></audio>
</div>
