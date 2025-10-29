<script lang="ts">
	import ActionButtons from '$lib/components/sections/ActionButtons.svelte'
	import AudioSection from '$lib/components/sections/AudioSection.svelte'
	import RecordingSection from '$lib/components/sections/RecordingSection.svelte'
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte'
	import { APP_TITLE } from '$lib/constants'
	import type { use_audio_state } from '$lib/hooks/UseAudioState.svelte'
	import type { use_phrase_state } from '$lib/hooks/UsePhraseState.svelte'
	import type { use_recording_state } from '$lib/hooks/UseRecordingState.svelte'
	import type { use_ui_state } from '$lib/hooks/UseUiState.svelte'
	import type { use_url_parameters } from '$lib/hooks/UseUrlParameters.svelte'
	import { is_iphone } from '$lib/utils/device'

	interface Props {
		audio: ReturnType<typeof use_audio_state>
		recording: ReturnType<typeof use_recording_state>
		ui: ReturnType<typeof use_ui_state>
		phrase: ReturnType<typeof use_phrase_state>
		url_parameters: ReturnType<typeof use_url_parameters>
		reset_all_states: () => void
	}

	const { audio, recording, ui, phrase, url_parameters, reset_all_states }: Props = $props()

	function handle_retry(): void {
		reset_all_states()
		audio.toggle()
	}

	function handle_next(): void {
		phrase.next()
		reset_all_states()
	}

	function handle_preview(): void {
		phrase.previous()
		reset_all_states()
	}

	function handle_clear_transcript(): void {
		recording.clear_transcript()
	}

	function autoplay(): void {
		if (is_iphone()) return
		void audio.play()
	}

	function handle_record(): void {
		if (audio.is_playing) audio.reset()
		if (!recording.toggle(url_parameters.lang)) autoplay()
	}

	function handle_play_audio(): void {
		recording.stop()
		audio.toggle()
	}

	function handle_can_play_through(): void {
		audio.can_play_through(recording.is_recording)
	}
</script>

<ProgressBar current={phrase.current_number} total={phrase.total} title={APP_TITLE} />

<div class="card-glass">
	<AudioSection
		phrase={phrase.current}
		is_playing={audio.is_playing}
		is_transcript_visible={ui.is_transcript_visible}
		is_translation_visible={ui.is_translation_visible}
		on_play_audio={handle_play_audio}
		on_can_play_through={handle_can_play_through}
		on_toggle_transcript={ui.toggle_transcript}
		on_toggle_translation={ui.toggle_translation}
		on_audio_ended={audio.pause}
		bind:audio_element={audio.audio_element}
	/>

	<RecordingSection
		is_recording={recording.is_recording}
		user_transcript={recording.user_transcript}
		is_correct={recording.is_correct}
		on_record={handle_record}
		on_clear_transcript={handle_clear_transcript}
	/>
</div>

<ActionButtons
	is_liked={ui.is_liked}
	is_completed={ui.is_completed}
	on_retry={handle_retry}
	on_next={handle_next}
	on_preview={handle_preview}
	on_toggle_completed={ui.toggle_completed}
	on_toggle_like={ui.toggle_like}
/>
