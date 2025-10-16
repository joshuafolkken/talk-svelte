<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { MicrophoneIcon, StopIcon } from './icons'
	import Section from './Section.svelte'
	import UserTranscriptButton from './UserTranscriptButton.svelte'

	interface Props {
		user_transcript: string
		is_recording: boolean
		on_record: VoidCallback
		on_clear_transcript: VoidCallback
	}

	let { is_recording, user_transcript, on_record, on_clear_transcript }: Props = $props()

	let recording_style = $derived(is_recording ? 'recording-active' : '')
</script>

<Section heading="Speak">
	<IconButton
		size="lg"
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

	<UserTranscriptButton {user_transcript} onclick={on_clear_transcript} />
</Section>
