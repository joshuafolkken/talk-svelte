import { use_audio_state } from '$lib/hooks/UseAudioState.svelte'
import { use_praise_audio_state } from '$lib/hooks/UsePraiseAudioState.svelte'
import { use_question_state } from '$lib/hooks/UseQuestionState.svelte'
import { use_recording_state } from '$lib/hooks/UseRecordingState.svelte'
import { use_responsive } from '$lib/hooks/UseResponsive.svelte'
import { use_ui_state } from '$lib/hooks/UseUiState.svelte'
import { use_url_parameters } from '$lib/hooks/UseUrlParameters.svelte'
import { is_transcript_correct } from '$lib/utils/transcript'

export function use_page_state(): {
	audio: ReturnType<typeof use_audio_state>
	recording: ReturnType<typeof use_recording_state>
	ui: ReturnType<typeof use_ui_state>
	question: ReturnType<typeof use_question_state>
	url_parameters: ReturnType<typeof use_url_parameters>
	responsive: ReturnType<typeof use_responsive>
	praise_audio: ReturnType<typeof use_praise_audio_state>
	reset_all_states: () => void
} {
	const audio = use_audio_state()
	const recording = use_recording_state()
	const ui = use_ui_state()
	const question = use_question_state()
	const url_parameters = use_url_parameters()
	const responsive = use_responsive()
	const praise_audio = use_praise_audio_state()

	function reset_all_states(): void {
		audio.reset()
		recording.reset()
		ui.reset()
	}

	async function handle_correct_transcript(): Promise<void> {
		recording.mark_correct(question.current.transcript)
		ui.toggle_completed()
		await praise_audio.play()
	}

	// Handle transcript correctness
	$effect(() => {
		if (recording.is_correct) return
		if (is_transcript_correct(question.current.transcript, recording.user_transcript)) {
			void handle_correct_transcript()
		}
	})

	return {
		audio,
		recording,
		ui,
		question,
		url_parameters,
		responsive,
		praise_audio,
		reset_all_states,
	}
}
