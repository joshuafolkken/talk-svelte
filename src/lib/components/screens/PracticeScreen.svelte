<script lang="ts">
	import { asset } from '$app/paths'
	import ActionButtons from '$lib/components/sections/ActionButtons.svelte'
	import AudioSection from '$lib/components/sections/AudioSection.svelte'
	import RecordingSection from '$lib/components/sections/RecordingSection.svelte'
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte'
	import { ACTIONS, type ActionName } from '$lib/constants/actions'
	import { APP } from '$lib/constants/app'
	import { AUDIO } from '$lib/constants/audio'
	import type { PhrasesModule } from '$lib/data/phrases/phrases'
	import { keyboard, type KeyName } from '$lib/keyboard/keyboard'
	import { on_keydown } from '$lib/keyboard/on-keydown'
	import { use_practice_state } from './UsePracticeState.svelte'

	interface Props {
		phrases_module: PhrasesModule
	}

	const { phrases_module }: Props = $props()

	const { audio, recording, ui, phrase, url_parameters, reset_all_states } = $derived(
		use_practice_state(phrases_module),
	)

	const audio_url = $derived(asset(`/${AUDIO.PATH}/${phrase.current.key}.mp3`))

	function handle_retry(): void {
		reset_all_states()
		setTimeout(() => {
			void audio.play(audio_url)
		}, AUDIO.PLAY_DELAY_MS)
	}

	function handle_next(): void {
		phrase.next()
		handle_retry()
	}

	function handle_preview(): void {
		phrase.previous()
		handle_retry()
	}

	function handle_clear_transcript(): void {
		recording.clear_transcript()
	}

	function autoplay(): void {
		setTimeout(() => {
			void audio.play(audio_url)
		}, AUDIO.PLAY_DELAY_MS)
	}

	function handle_record(): void {
		const is_playing_before = audio.is_playing
		const delay_ms = is_playing_before ? AUDIO.RECORD_DELAY_MS : 0

		if (is_playing_before) {
			audio.stop()
		}

		setTimeout(() => {
			if (!recording.toggle(url_parameters.lang)) {
				autoplay()
			}
		}, delay_ms)
	}

	function handle_play_audio(): void {
		const is_recording_before = recording.is_recording
		const delay_ms = is_recording_before ? AUDIO.PLAY_DELAY_MS : 0

		if (is_recording_before) {
			recording.stop()
		}

		// 録音停止後の再生開始を遅延させる
		setTimeout(() => {
			if (!recording.is_recording) {
				audio.toggle(audio_url)
			}
		}, delay_ms)
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
		on_toggle_transcript={ui.toggle_transcript}
		on_toggle_translation={ui.toggle_translation}
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
