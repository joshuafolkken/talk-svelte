<script lang="ts">
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { questions } from '$lib/data/questions'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'

	const title = 'Talk'
	const AUDIO_RESTART_DELAY_MS = 50

	let current_question = $state(1)
	let total_questions = $derived(questions.length)
	let is_playing = $state(false)
	let show_transcript = $state(false)
	let show_translation = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('Yay!')
	let liked = $state(false)
	let question = $state(questions[0]!)

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

	function on_toggle_transcript(): void {
		show_transcript = !show_transcript
	}

	function on_toggle_translation(): void {
		show_translation = !show_translation
	}

	function on_toggle_recording(): void {
		is_recording = !is_recording
	}

	function on_toggle_like(): void {
		liked = !liked
	}

	function on_retry(): void {
		show_transcript = false
		show_translation = false
		user_transcript = ''
		liked = false

		if (audio_element && is_playing) {
			audio_element.pause()
			audio_element.currentTime = 0
		}
		is_playing = false

		setTimeout(() => {
			on_play_audio()
		}, AUDIO_RESTART_DELAY_MS)
	}

	function on_next(): void {
		if (current_question < total_questions) {
			question = questions[current_question]!
			current_question++
			on_retry()
		}
	}
</script>

<div class="relative min-h-screen overflow-hidden px-4 py-12">
	<YoutubeBackground />

	<div class="mx-auto max-w-xl">
		<ProgressBar current={current_question} total={total_questions} {title} />

		<!-- Main Card with STRONG Glass Effect -->
		<div class="card-glass">
			<AudioSection
				{question}
				{is_playing}
				{show_transcript}
				{show_translation}
				{on_play_audio}
				{on_toggle_transcript}
				{on_toggle_translation}
				on_audio_ended={() => (is_playing = false)}
				bind:audio_element
			/>

			<RecordingSection {is_recording} {user_transcript} {on_toggle_recording} />

			<ActionButtons {liked} {on_toggle_like} {on_retry} {on_next} />
		</div>
	</div>
</div>
