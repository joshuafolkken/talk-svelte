<script lang="ts">
	import { BUTTON_SIZES, BUTTON_STYLES } from '$lib/constants'
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { MicrophoneIcon, StopIcon } from './icons'
	import Section from './Section.svelte'
	import UserTranscriptButton from './UserTranscriptButton.svelte'

	interface Props {
		is_recording: boolean
		user_transcript: string
		is_correct: boolean
		on_record: VoidCallback
		on_clear_transcript: VoidCallback
	}

	let { is_recording, user_transcript, is_correct, on_record, on_clear_transcript }: Props =
		$props()

	let recording_style = $derived(is_recording ? BUTTON_STYLES.RECORDING_ACTIVE : '')
</script>

<Section heading="Speak">
	<IconButton
		size={BUTTON_SIZES.LG}
		onclick={on_record}
		class={recording_style}
		label={is_recording ? 'Stop' : 'Record'}
	>
		{#if is_recording}
			<StopIcon />
		{:else}
			<MicrophoneIcon />
		{/if}
	</IconButton>

	<UserTranscriptButton {user_transcript} {is_correct} onclick={on_clear_transcript} />
</Section>
