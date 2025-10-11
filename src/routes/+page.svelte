<script lang="ts">
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { questions } from '$lib/data/questions'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'

	const title = 'Talk'
	const AUDIO_RESTART_DELAY_MS = 50

	let current_index = $state(0)
	let total_questions = $derived(questions.length)
	let current_question_number = $derived(current_index + 1)
	let question = $derived(questions[current_index]!)

	let is_playing = $state(false)
	let show_transcript = $state(false)
	let show_translation = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('')
	let liked = $state(false)

	let audio_element = $state<HTMLAudioElement>()

	function on_play_audio(): void {
		if (!audio_element) return

		if (is_playing) {
			audio_element.pause()
			is_playing = false
		} else {
			audio_element.play()
			is_playing = true
		}
	}

	function reset_audio(): void {
		if (audio_element && is_playing) {
			audio_element.pause()
			audio_element.currentTime = 0
		}
		is_playing = false
	}

	function reset_recording(): void {
		is_recording = false
		user_transcript = ''
	}

	function reset_user_state(): void {
		show_transcript = false
		show_translation = false
		liked = false
	}

	function on_retry(): void {
		reset_audio()
		reset_recording()
		reset_user_state()

		setTimeout(() => {
			on_play_audio()
		}, AUDIO_RESTART_DELAY_MS)
	}

	function on_next(): void {
		if (current_index < total_questions - 1) {
			current_index++
			on_retry()
		}
	}
</script>

<div class="relative min-h-screen overflow-hidden px-4 py-12">
	<YoutubeBackground />

	<div class="mx-auto max-w-xl">
		<ProgressBar current={current_question_number} total={total_questions} {title} />

		<div class="card-glass">
			<AudioSection
				{question}
				{is_playing}
				{show_transcript}
				{show_translation}
				{on_play_audio}
				on_toggle_transcript={() => (show_transcript = !show_transcript)}
				on_toggle_translation={() => (show_translation = !show_translation)}
				on_audio_ended={() => (is_playing = false)}
				bind:audio_element
			/>

			<RecordingSection
				{is_recording}
				{user_transcript}
				on_toggle_recording={() => (is_recording = !is_recording)}
			/>

			<ActionButtons {liked} {on_retry} {on_next} on_toggle_like={() => (liked = !liked)} />
		</div>
	</div>
</div>
