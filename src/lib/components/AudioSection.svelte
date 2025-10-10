<script lang="ts">
	import type { Question } from '$lib/types/question'
	import ToggleRevealButton from './ToggleRevealButton.svelte'

	interface Props {
		question: Question
		is_playing: boolean
		show_transcript: boolean
		show_translation: boolean
		on_play_audio: () => void
		on_toggle_transcript: () => void
		on_toggle_translation: () => void
		on_audio_ended: () => void
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

<!-- Audio Section-->
<div class="border-b border-white/25 p-12" style="background: rgba(255, 255, 255, 0.05);">
	<h2
		class="mb-8 text-center text-sm font-bold tracking-widest text-white uppercase drop-shadow-md"
	>
		Listen
	</h2>
	<div class="mb-8 flex justify-center">
		<button
			onclick={on_play_audio}
			class="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:border-white/60 hover:shadow-2xl active:scale-95"
			style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);"
		>
			<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				{#if is_playing}
					<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
				{:else}
					<path d="M8 5v14l11-7z" />
				{/if}
			</svg>
		</button>
	</div>
	<audio bind:this={audio_element} src="/audio/{question.audio_uri}" onended={on_audio_ended}
	></audio>

	<ToggleRevealButton
		revealed={show_transcript}
		label="Transcript"
		content={question.transcript}
		on_toggle={on_toggle_transcript}
		class="mb-4"
	/>

	<ToggleRevealButton
		revealed={show_translation}
		label="Translation"
		content={question.translation}
		on_toggle={on_toggle_translation}
	/>
</div>
