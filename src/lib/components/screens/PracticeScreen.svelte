<script lang="ts">
	import ActionButtons from '$lib/components/sections/ActionButtons.svelte'
	import AudioSection from '$lib/components/sections/AudioSection.svelte'
	import RecordingSection from '$lib/components/sections/RecordingSection.svelte'
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte'
	import { ACTIONS, type ActionName } from '$lib/constants/actions'
	import { APP } from '$lib/constants/app'
	import { keyboard, type KeyName } from '$lib/keyboard/keyboard'
	import { on_keydown } from '$lib/keyboard/on-keydown'
	import { device } from '$lib/utils/device'
	import { use_practice_state } from './UsePracticeState.svelte'

	const { audio, recording, ui, phrase, url_parameters, reset_all_states } = use_practice_state()

	const AUTOPLAY_TIMEOUT_IPHONE_MS = 1500
	const AUTOPLAY_TIMEOUT_DEFAULT_MS = 200

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
		const timeout = device.is_iphone() ? AUTOPLAY_TIMEOUT_IPHONE_MS : AUTOPLAY_TIMEOUT_DEFAULT_MS

		setTimeout(() => {
			void audio.play()
		}, timeout)
	}

	function handle_record(): void {
		if (audio.is_playing) audio.reset()
		if (!recording.toggle(url_parameters.lang, false)) autoplay()
	}

	function handle_play_audio(): void {
		recording.stop()
		audio.toggle()
	}

	function handle_can_play_through(): void {
		audio.can_play_through(recording.is_recording)
	}

	const action_by_key = new Map<KeyName, ActionName>([
		[keyboard.KEYS.A, ACTIONS.PREV],
		[keyboard.KEYS.D, ACTIONS.NEXT],
		[keyboard.KEYS.SPACE, ACTIONS.TOGGLE_PLAY],
		[keyboard.KEYS.F, ACTIONS.TOGGLE_RECORD],
		[keyboard.KEYS.Q, ACTIONS.TOGGLE_TRANSCRIPT],
		[keyboard.KEYS.E, ACTIONS.TOGGLE_TRANSLATION],
		[keyboard.KEYS.V, ACTIONS.CLEAR_TRANSCRIPT],
		[keyboard.KEYS.R, ACTIONS.RETRY],
		[keyboard.KEYS.Z, ACTIONS.MENU],
	])

	function get_action_by_key(key: KeyName): ActionName | undefined {
		return action_by_key.get(key)
	}

	const handle_keydown = on_keydown.create(get_action_by_key)

	$effect(() => {
		globalThis.addEventListener('keydown', handle_keydown)
		return () => {
			globalThis.removeEventListener('keydown', handle_keydown)
		}
	})
</script>

<ProgressBar current={phrase.current_number} total={phrase.total} title={APP.NAME} />

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
