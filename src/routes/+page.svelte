<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { APP_TITLE, DEFAULT_LANGUAGE } from '$lib/constants'
	import { questions } from '$lib/data/questions'
	import { pause_audio, play_audio, reset_audio } from '$lib/utils/audio'
	import { calculate_scale_factor, debounce } from '$lib/utils/responsive'
	import { SpeechToText } from '$lib/utils/speech-to-text'
	import { is_transcript_correct } from '$lib/utils/transcript'

	let current_index = $state(0)
	const total_questions = $derived(questions.length)
	const current_question_number = $derived(current_index + 1)
	const question = $derived.by(() => {
		const current_question = questions[current_index]
		if (current_question === undefined) {
			throw new Error(`Question at index ${String(current_index)} not found`)
		}
		return current_question
	})

	let is_playing = $state(false)
	let is_transcript_visible = $state(false)
	let is_translation_visible = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('')
	let is_correct = $state(false)
	let is_liked = $state(false)
	let is_completed = $state(false)

	let audio_element = $state<HTMLAudioElement>()
	// eslint-disable-next-line unicorn/no-useless-undefined
	let speech_to_text: SpeechToText | undefined = undefined

	// let lang = $derived(page.url.searchParams.get('lang') || 'en-US')
	// let v = $derived(page.url.searchParams.get('v') || undefined)
	// let t = $derived(page.url.searchParams.get('t') || undefined)

	let lang = $state(DEFAULT_LANGUAGE)
	let video_id = $state<string>()
	let time = $state<string>()

	function get_parameter(name: string): string | undefined {
		const value = page.url.searchParams.get(name)
		if (value === null) return undefined
		return value
	}

	$effect(() => {
		if (!browser) return

		lang = get_parameter('lang') ?? DEFAULT_LANGUAGE
		video_id = get_parameter('v')
		time = get_parameter('t')
	})

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

		return (): void => {
			speech_to_text?.destroy()
		}
	})

	let scale_factor = $state(1)

	function update_scale(): void {
		scale_factor = calculate_scale_factor()
	}

	$effect(() => {
		if (!browser) {
			return (): void => {
				// operation
			}
		}

		const debounced_update_scale = debounce(update_scale)

		update_scale()
		window.addEventListener('resize', debounced_update_scale)

		return (): void => {
			window.removeEventListener('resize', debounced_update_scale)
		}
	})

	async function play_audio_safely(): Promise<void> {
		if (audio_element === undefined) return

		try {
			await play_audio(audio_element)
			is_playing = true
		} catch {
			is_playing = false
		}
	}

	function stop_audio(): void {
		if (audio_element === undefined) return
		pause_audio(audio_element)
		is_playing = false
	}

	function handle_play_audio(): void {
		if (audio_element === undefined) return

		if (is_recording) {
			is_recording = false
		}

		if (is_playing) {
			stop_audio()
		} else {
			void play_audio_safely()
		}
	}

	function reset_audio_state(): void {
		reset_audio(audio_element)
		is_playing = false
	}

	function reset_transcript(): void {
		user_transcript = ''
		is_correct = false
	}

	function reset_recording(): void {
		is_recording = false
		reset_transcript()
	}

	function reset_user_state(): void {
		is_transcript_visible = false
		is_translation_visible = false
		is_liked = false
		is_completed = false
	}

	function reset_state(): void {
		reset_audio_state()
		reset_recording()
		reset_user_state()
	}

	function handle_retry(): void {
		reset_state()
		handle_play_audio()
	}

	function handle_next(): void {
		if (current_index < total_questions - 1) {
			current_index += 1
			reset_state()
		}
	}

	function handle_preview(): void {
		if (current_index > 0) {
			current_index -= 1
			reset_state()
		}
	}

	function handle_clear_transcript(): void {
		reset_transcript()

		if (is_recording && speech_to_text !== undefined) {
			speech_to_text.restart()
		}
	}

	function handle_record(): void {
		if (is_playing) {
			reset_audio_state()
		}

		is_recording = !is_recording
	}

	function handle_can_play_through(): void {
		if (is_playing || is_recording) return
		handle_play_audio()
	}

	function handle_correct_transcript(): void {
		user_transcript = question.transcript
		is_correct = true
		is_completed = true
		is_recording = false
	}

	$effect(() => {
		if (is_recording) {
			reset_transcript()
			speech_to_text?.start(lang)
		} else {
			speech_to_text?.stop()
		}
	})

	$effect(() => {
		if (is_transcript_correct(question.transcript, user_transcript)) {
			handle_correct_transcript()
		}
	})
</script>

<div class="relative min-h-screen overflow-hidden">
	<YoutubeBackground {video_id} {time} />

	<div
		class="m-4 mx-auto max-w-sm transition-transform"
		style="transform: scale({scale_factor}); transform-origin: top center;"
	>
		<ProgressBar current={current_question_number} total={total_questions} title={APP_TITLE} />

		<div class="card-glass">
			<AudioSection
				{question}
				{is_playing}
				{is_transcript_visible}
				{is_translation_visible}
				on_play_audio={handle_play_audio}
				on_can_play_through={handle_can_play_through}
				on_toggle_transcript={(): void => {
					is_transcript_visible = !is_transcript_visible
				}}
				on_toggle_translation={(): void => {
					is_translation_visible = !is_translation_visible
				}}
				on_audio_ended={(): void => {
					is_playing = false
				}}
				bind:audio_element
			/>

			<RecordingSection
				{is_recording}
				{user_transcript}
				{is_correct}
				on_record={handle_record}
				on_clear_transcript={handle_clear_transcript}
			/>
		</div>

		<ActionButtons
			{is_liked}
			{is_completed}
			on_retry={handle_retry}
			on_next={handle_next}
			on_preview={handle_preview}
			on_toggle_completed={(): void => {
				is_completed = !is_completed
			}}
			on_toggle_like={(): void => {
				is_liked = !is_liked
			}}
		/>
	</div>
</div>
