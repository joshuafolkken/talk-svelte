<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte'
	import AudioSection from '$lib/components/AudioSection.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import RecordingSection from '$lib/components/RecordingSection.svelte'
	import YoutubeBackground from '$lib/components/YoutubeBackground.svelte'
	import { APP_TITLE } from '$lib/constants'
	import { is_iphone } from '$lib/utils/device'
	import { use_page_state } from './UsePageState.svelte'

	const {
		audio,
		recording,
		ui: ui,
		question: question,
		url_parameters,
		responsive,
		reset_all_states,
	} = use_page_state()

	function handle_retry(): void {
		reset_all_states()
		audio.toggle()
	}

	function handle_next(): void {
		question.next()
		reset_all_states()
	}

	function handle_preview(): void {
		question.previous()
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

<div class="relative min-h-screen overflow-hidden">
	<YoutubeBackground video_id={url_parameters.video_id} time={url_parameters.time} />

	<div
		class="m-4 mx-auto max-w-sm transition-transform"
		style="transform: scale({responsive.scale_factor}); transform-origin: top center;"
	>
		<ProgressBar current={question.current_number} total={question.total} title={APP_TITLE} />

		<div class="card-glass">
			<AudioSection
				question={question.current}
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
	</div>
</div>
