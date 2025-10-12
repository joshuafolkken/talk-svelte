<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { ChevronDownIcon, MicrophoneIcon, StopIcon } from './icons'
	import Section from './Section.svelte'

	interface Props {
		user_transcript: string
		is_recording: boolean
		on_toggle_recording: VoidCallback
	}

	let { is_recording, user_transcript, on_toggle_recording }: Props = $props()

	let recording_style = $derived(is_recording ? 'recording-active' : '')
	let transcript_style = $derived(user_transcript ? 'text-white' : '')
</script>

<Section heading="Speak">
	<IconButton
		onclick={on_toggle_recording}
		class={recording_style}
		label={is_recording ? 'Stop' : 'Record'}
	>
		{#if is_recording}
			<StopIcon />
		{:else}
			<MicrophoneIcon />
		{/if}
	</IconButton>

	<div class="content-glass {transcript_style}">
		{#if user_transcript}
			<span class="text-content-bold">{user_transcript}</span>
		{:else}
			<div class="flex-center">
				<span class="text-content-semibold">You …</span>
				<ChevronDownIcon />
			</div>
		{/if}
	</div>
</Section>
