import { use_audio_state } from '$lib/hooks/UseAudioState.svelte'
import { use_phrase_state } from '$lib/hooks/UsePhraseState.svelte'
import { use_praise_audio_state } from '$lib/hooks/UsePraiseAudioState.svelte'
import { use_recording_state } from '$lib/hooks/UseRecordingState.svelte'
import { use_ui_state } from '$lib/hooks/UseUiState.svelte'
import { use_url_parameters } from '$lib/hooks/UseUrlParameters.svelte'
import { transcript } from '$lib/utils/transcript'

export function use_practice_state(): {
	audio: ReturnType<typeof use_audio_state>
	recording: ReturnType<typeof use_recording_state>
	ui: ReturnType<typeof use_ui_state>
	phrase: ReturnType<typeof use_phrase_state>
	url_parameters: ReturnType<typeof use_url_parameters>
	praise_audio: ReturnType<typeof use_praise_audio_state>
	reset_all_states: () => void
} {
	const audio = use_audio_state()
	const recording = use_recording_state()
	const ui = use_ui_state()
	const phrase = use_phrase_state()
	const url_parameters = use_url_parameters()
	const praise_audio = use_praise_audio_state()

	function reset_all_states(): void {
		audio.reset()
		recording.reset()
		ui.reset()
	}

	async function handle_correct_transcript(): Promise<void> {
		recording.mark_correct(phrase.current.script)
		ui.toggle_completed()
		await praise_audio.play()
	}

	// Handle transcript correctness
	$effect(() => {
		if (recording.is_correct) return
		if (transcript.is_included(phrase.current.script, recording.user_transcript)) {
			void handle_correct_transcript()
		}
	})

	return {
		audio,
		recording,
		ui,
		phrase,
		url_parameters,
		praise_audio,
		reset_all_states,
	}
}
