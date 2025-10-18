<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { DEFAULT_LANGUAGE } from '$lib/constants'
	import { questions } from '$lib/data/questions'
	import { SpeechToText } from '$lib/utils/speech-to-text'

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
	let is_correct = $state(false)
	let liked = $state(false)

	let audio_element = $state<HTMLAudioElement>()
	let speech_to_text: SpeechToText | null = null

	// let lang = $derived(page.url.searchParams.get('lang') || 'en-US')
	// let v = $derived(page.url.searchParams.get('v') || undefined)
	// let t = $derived(page.url.searchParams.get('t') || undefined)

	let lang = $state(DEFAULT_LANGUAGE)
	let v = $state<string | undefined>()
	let t = $state<string | undefined>()

	$effect(() => {
		if (!browser) return

		lang = page.url.searchParams.get('lang') || DEFAULT_LANGUAGE
		v = page.url.searchParams.get('v') || undefined
		t = page.url.searchParams.get('t') || undefined
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

		return () => {
			speech_to_text?.destroy()
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

	let scale_factor = $state(1)

	$effect(() => {
		if (!browser) return

		const updateScale = () => {
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight

			const userAgent = navigator.userAgent.toLowerCase()
			const isIOS = /iphone|ipod/.test(userAgent)
			const isAndroid = /android/.test(userAgent)
			const isTablet =
				/ipad/.test(userAgent) ||
				((window.innerWidth >= 1024 || window.innerHeight >= 1024) &&
					(window.innerWidth >= 600 || window.innerHeight >= 600))

			if ((isIOS || isAndroid) && !isTablet) {
				scale_factor = 1
				return
			}

			// 36
			const baseWidth = 404
			const baseHeight = 710

			const scaleX = viewportWidth / baseWidth
			const scaleY = viewportHeight / baseHeight

			// スケールを制限（0.7〜1.5倍）
			scale_factor = Math.max(0.1, Math.min(scaleX, scaleY, 3))
		}

		let resizeTimeout: ReturnType<typeof setTimeout> | undefined

		const debouncedUpdateScale = () => {
			clearTimeout(resizeTimeout)
			resizeTimeout = setTimeout(updateScale, 200)
		}

		updateScale()
		window.addEventListener('resize', debouncedUpdateScale)

		return () => {
			window.removeEventListener('resize', debouncedUpdateScale)
		}
	})

	function handle_play_audio(): void {
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

	function reset_transcript(): void {
		user_transcript = ''
		is_correct = false
	}

	function reset_recording(): void {
		is_recording = false
		reset_transcript()
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
		handle_play_audio()
	}

	function on_next(): void {
		if (current_index < total_questions - 1) {
			current_index++
			reset_state()
		}
	}

	function on_preview(): void {
		if (current_index > 0) {
			current_index--
			reset_state()
		}
	}

	function on_clear_transcript(): void {
		reset_transcript()

		if (is_recording && speech_to_text) {
			speech_to_text.restart()
		}
	}

	function on_record(): void {
		reset_audio()
		is_recording = !is_recording
	}

	function handle_can_play_through(): void {
		if (is_playing || is_recording) return
		handle_play_audio()
	}

	function is_transcript_correct(): boolean {
		const cleaned_transcript = question.transcript.replace(/[,.!]/g, '').trim().toLowerCase()
		const cleaned_user_transcript = user_transcript.replace(/[,.!]/g, '').trim().toLowerCase()

		return cleaned_transcript === cleaned_user_transcript
	}

	function handle_correct_transcript() {
		user_transcript = question.transcript
		is_correct = true
		is_recording = false
	}

	$effect(() => {
		if (is_transcript_correct()) handle_correct_transcript()
	})
</script>

<div class="relative min-h-screen overflow-hidden">
	<YoutubeBackground {v} {t} />

	<div
		class="m-4 mx-auto max-w-sm transition-transform"
		style="transform: scale({scale_factor}); transform-origin: top center;"
	>
		<ProgressBar current={current_question_number} total={total_questions} title={TITLE} />

		<div class="card-glass">
			<AudioSection
				{question}
				{is_playing}
				{show_transcript}
				{show_translation}
				on_play_audio={handle_play_audio}
				on_can_play_through={handle_can_play_through}
				on_toggle_transcript={() => (show_transcript = !show_transcript)}
				on_toggle_translation={() => (show_translation = !show_translation)}
				on_audio_ended={() => (is_playing = false)}
				bind:audio_element
			/>

			<RecordingSection
				{is_recording}
				{user_transcript}
				{is_correct}
				{on_record}
				{on_clear_transcript}
			/>
		</div>

		<ActionButtons
			{liked}
			{on_retry}
			{on_next}
			{on_preview}
			on_toggle_like={() => (liked = !liked)}
		/>
	</div>
</div>
