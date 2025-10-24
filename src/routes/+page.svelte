<script lang="ts">
	import { browser } from '$app/environment'
	import { asset } from '$app/paths'
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { APP_TITLE, AUDIO_PATH } from '$lib/constants'
	import { get_praise_audio_file, praise_audio_files } from '$lib/data/praise-audio'
	import { use_audio_state } from '$lib/hooks/UseAudioState.svelte'
	import { use_question_state } from '$lib/hooks/UseQuestionState.svelte'
	import { use_recording_state } from '$lib/hooks/UseRecordingState.svelte'
	import { use_responsive } from '$lib/hooks/UseResponsive.svelte'
	import { use_ui_state } from '$lib/hooks/UseUiState.svelte'
	import { use_url_parameters } from '$lib/hooks/UseUrlParameters.svelte'
	import { is_transcript_correct } from '$lib/utils/transcript'

	const AUDIO_PRELOAD_STRATEGY = 'auto'
	const AUDIO_RESET_TIME = 0

	// Initialize hooks
	const audio_state = use_audio_state()
	const recording_state = use_recording_state()
	const ui_state = use_ui_state()
	const question_state = use_question_state()
	const url_parameters = use_url_parameters()
	const responsive = use_responsive()

	const praise_audio_map = $state<Map<string, HTMLAudioElement>>(new Map())

	function reset_state(): void {
		audio_state.reset()
		recording_state.reset()
		ui_state.reset()
	}

	function handle_retry(): void {
		reset_state()
		recording_state.reset()
		audio_state.toggle()
	}

	function handle_next(): void {
		question_state.next()
		reset_state()
	}

	function handle_preview(): void {
		question_state.previous()
		reset_state()
	}

	function handle_clear_transcript(): void {
		recording_state.clear_transcript()
	}

	function handle_record(): void {
		audio_state.reset()
		recording_state.toggle(url_parameters.lang)
	}

	function handle_correct_transcript(): void {
		recording_state.mark_correct(question_state.question.transcript)
		ui_state.toggle_completed()
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
		if (recording_state.is_correct) return
		if (
			is_transcript_correct(question_state.question.transcript, recording_state.user_transcript)
		) {
			handle_correct_transcript()
			play_praise_audio()
		}
	})

	function handle_play_audio_state(): void {
		recording_state.stop()
		audio_state.toggle()
	}

	function handle_can_play_through_state(): void {
		audio_state.can_play_through(recording_state.is_recording)
	}
</script>

<div class="relative min-h-screen overflow-hidden">
	<YoutubeBackground video_id={url_parameters.video_id} time={url_parameters.time} />

	<div
		class="m-4 mx-auto max-w-sm transition-transform"
		style="transform: scale({responsive.scale_factor}); transform-origin: top center;"
	>
		<ProgressBar
			current={question_state.current_question_number}
			total={question_state.total_questions}
			title={APP_TITLE}
		/>

		<div class="card-glass">
			<AudioSection
				question={question_state.question}
				is_playing={audio_state.is_playing}
				is_transcript_visible={ui_state.is_transcript_visible}
				is_translation_visible={ui_state.is_translation_visible}
				on_play_audio={handle_play_audio_state}
				on_can_play_through={handle_can_play_through_state}
				on_toggle_transcript={ui_state.toggle_transcript}
				on_toggle_translation={ui_state.toggle_translation}
				on_audio_ended={audio_state.pause}
				bind:audio_element={audio_state.audio_element}
			/>

			<RecordingSection
				is_recording={recording_state.is_recording}
				user_transcript={recording_state.user_transcript}
				is_correct={recording_state.is_correct}
				on_record={handle_record}
				on_clear_transcript={handle_clear_transcript}
			/>
		</div>

		<ActionButtons
			is_liked={ui_state.is_liked}
			is_completed={ui_state.is_completed}
			on_retry={handle_retry}
			on_next={handle_next}
			on_preview={handle_preview}
			on_toggle_completed={ui_state.toggle_completed}
			on_toggle_like={ui_state.toggle_like}
		/>
	</div>
</div>
