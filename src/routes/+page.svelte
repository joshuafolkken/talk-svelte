<script lang="ts">
	import { page } from '$app/state'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { questions } from '$lib/data/questions'
	import { SpeechToText } from '$lib/utils/SpeechToText'

	const TITLE = 'Talk'

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
	let speech_to_text: SpeechToText | null = null

	let lang = $derived(page.url.searchParams.get('lang') || 'en-US')
	let v = $derived(page.url.searchParams.get('v') || undefined)
	let t = $derived(page.url.searchParams.get('t') || undefined)

	$effect(() => {
		speech_to_text = new SpeechToText(
			(transcript) => {
				user_transcript = transcript
			},
			(error) => {
				console.error('Speech recognition error:', error)
				is_recording = false
			},
		)

		return () => {
			speech_to_text?.destroy()
		}
	})

	$effect(() => {
		if (is_recording) {
			user_transcript = ''
			speech_to_text?.start(lang)
		} else {
			speech_to_text?.stop()
		}
	})

	function on_play_audio(): void {
		if (!audio_element) return

		if (is_recording) {
			is_recording = false
		}

		if (is_playing) {
			audio_element.pause()
			is_playing = false
		} else {
			audio_element.play().catch((error) => {
				console.error('Failed to play audio: ', error)
				is_playing = false
			})
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

	function reset_state(): void {
		reset_audio()
		reset_recording()
		reset_user_state()
	}

	function on_retry(): void {
		reset_state()
		on_play_audio()
	}

	function on_next(): void {
		if (current_index < total_questions - 1) {
			current_index++
			reset_state()
		}
	}

	function on_clear_transcript(): void {
		user_transcript = ''

		if (is_recording && speech_to_text) {
			speech_to_text.restart()
		}
	}

	function on_record(): void {
		reset_audio()
		is_recording = !is_recording
	}

	function on_can_play_through(): void {
		if (is_playing || is_recording) return
		on_play_audio()
	}
</script>

<div class="relative min-h-screen overflow-hidden px-4 py-12">
	<YoutubeBackground {v} {t} />

	<div class="mx-auto max-w-xl">
		<ProgressBar current={current_question_number} total={total_questions} title={TITLE} />

		<div class="card-glass">
			<AudioSection
				{question}
				{is_playing}
				{show_transcript}
				{show_translation}
				{on_play_audio}
				{on_can_play_through}
				on_toggle_transcript={() => (show_transcript = !show_transcript)}
				on_toggle_translation={() => (show_translation = !show_translation)}
				on_audio_ended={() => (is_playing = false)}
				bind:audio_element
			/>

			<RecordingSection {is_recording} {user_transcript} {on_record} {on_clear_transcript} />

			<ActionButtons {liked} {on_retry} {on_next} on_toggle_like={() => (liked = !liked)} />
		</div>
	</div>
</div>
