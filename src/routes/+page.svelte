<script lang="ts">
	import { browser } from '$app/environment'
	import { asset } from '$app/paths'
	import { page } from '$app/state'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { APP_TITLE, AUDIO_PATH, DEFAULT_LANGUAGE } from '$lib/constants'
	import { get_praise_audio_file, praise_audio_files } from '$lib/data/praise-audio'
	import { get_shuffled_questions } from '$lib/data/questions'
	import { use_audio_state } from '$lib/hooks/UseAudioState.svelte'
	import { calculate_scale_factor, debounce } from '$lib/utils/responsive'
	import { SpeechToText } from '$lib/utils/speech-to-text'
	import { is_transcript_correct } from '$lib/utils/transcript'

	const INITIAL_QUESTION_INDEX = 0
	const AUDIO_PRELOAD_STRATEGY = 'auto'
	const AUDIO_RESET_TIME = 0

	let questions = $state(get_shuffled_questions())

	$effect(() => {
		if (!browser) return

		questions = get_shuffled_questions()
	})

	let current_index = $state(INITIAL_QUESTION_INDEX)
	const total_questions = $derived(questions.length)
	const current_question_number = $derived(current_index + 1)
	const question = $derived.by(() => {
		const current_question = questions[current_index]
		if (current_question === undefined) {
			throw new Error(`Question at index ${String(current_index)} not found`)
		}
		return current_question
	})

	const audio_state = use_audio_state()

	let is_transcript_visible = $state(false)
	let is_translation_visible = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('')
	let is_correct = $state(false)
	let is_liked = $state(false)
	let is_completed = $state(false)

	const praise_audio_map = $state<Map<string, HTMLAudioElement>>(new Map())

	// eslint-disable-next-line unicorn/no-useless-undefined
	let speech_to_text: SpeechToText | undefined = undefined

	// let lang = $derived(page.url.searchParams.get('lang') || 'en-US')
	// let v = $derived(page.url.searchParams.get('v') || undefined)
	// let t = $derived(page.url.searchParams.get('t') || undefined)

	let lang = $state(DEFAULT_LANGUAGE)
	let video_id = $state<string>()
	let time = $state<string>()

	function get_url_parameter(name: string): string | undefined {
		return page.url.searchParams.get(name) ?? undefined
	}

	$effect(() => {
		if (!browser) return

		lang = get_url_parameter('lang') ?? DEFAULT_LANGUAGE
		video_id = get_url_parameter('v')
		time = get_url_parameter('t')
	})

	$effect(() => {
		speech_to_text = new SpeechToText(
			(transcript) => {
				if (is_correct) return
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
		audio_state.reset()
		reset_recording()
		reset_user_state()
	}

	function set_recording(value: boolean): void {
		is_recording = value
	}

	function handle_retry(): void {
		reset_state()
		audio_state.play(is_recording, set_recording)
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
		if (audio_state.is_playing) {
			audio_state.reset()
		}

		is_recording = !is_recording
	}

	function handle_correct_transcript(): void {
		is_correct = true
		is_completed = true
		is_recording = false

		user_transcript = question.transcript
	}

	function play_praise_audio(): void {
		const praise_audio_file = get_praise_audio_file()
		if (praise_audio_file.length === 0) return

		const praise_audio = praise_audio_map.get(praise_audio_file)
		if (praise_audio === undefined) return
		praise_audio.currentTime = AUDIO_RESET_TIME
		void praise_audio.play()
	}

	$effect(() => {
		if (!browser) return

		for (const filename of praise_audio_files) {
			const audio = new Audio(asset(`/${AUDIO_PATH}/${filename}.mp3`))
			audio.preload = AUDIO_PRELOAD_STRATEGY
			praise_audio_map.set(filename, audio)
		}
	})

	$effect(() => {
		if (is_recording) {
			reset_transcript()
			speech_to_text?.start(lang)
		} else {
			speech_to_text?.stop()
		}
	})

	$effect(() => {
		if (is_correct) return
		if (is_transcript_correct(question.transcript, user_transcript)) {
			handle_correct_transcript()
			play_praise_audio()
		}
	})

	function handle_play_audio_state(): void {
		audio_state.play(is_recording, set_recording)
	}

	function handle_can_play_through_state(): void {
		audio_state.can_play_through(is_recording)
	}
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
				is_playing={audio_state.is_playing}
				{is_transcript_visible}
				{is_translation_visible}
				on_play_audio={handle_play_audio_state}
				on_can_play_through={handle_can_play_through_state}
				on_toggle_transcript={(): void => {
					is_transcript_visible = !is_transcript_visible
				}}
				on_toggle_translation={(): void => {
					is_translation_visible = !is_translation_visible
				}}
				on_audio_ended={audio_state.stop}
				bind:audio_element={audio_state.audio_element}
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
