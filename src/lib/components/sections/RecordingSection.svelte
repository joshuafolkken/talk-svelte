<script lang="ts">
	import UserTranscriptButton from '$lib/components/features/UserTranscriptButton.svelte'
	import { MicrophoneIcon, StopIcon } from '$lib/components/icons'
	import IconButton from '$lib/components/ui/IconButton.svelte'
	import Section from '$lib/components/ui/Section.svelte'
	import { ACTIONS } from '$lib/constants/actions'
	import { UI } from '$lib/constants/ui'
	import type { VoidCallback } from '$lib/types'

	interface Props {
		is_recording: boolean
		user_transcript: string
		is_correct: boolean
		on_record: VoidCallback
		on_clear_transcript: VoidCallback
	}

	const { is_recording, user_transcript, is_correct, on_record, on_clear_transcript }: Props =
		$props()

	const recording_style = $derived(is_recording ? UI.BUTTON_STYLES.RECORDING_ACTIVE : '')
</script>

<Section heading="Speak">
	<IconButton
		size={UI.BUTTON_SIZES.LG}
		onclick={on_record}
		class={recording_style}
		label={is_recording ? 'Stop' : 'Record'}
		data_action={ACTIONS.TOGGLE_RECORD}
	>
		{#if is_recording}
			<StopIcon />
		{:else}
			<MicrophoneIcon />
		{/if}
	</IconButton>

	<UserTranscriptButton {user_transcript} {is_correct} onclick={on_clear_transcript} />
</Section>
