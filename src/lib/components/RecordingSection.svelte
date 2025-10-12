<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { ChevronDownIcon, MicrophoneIcon, StopIcon } from './icons'
	import Section from './Section.svelte'

	interface Props {
		is_recording: boolean
		user_transcript: string
		on_toggle_recording: VoidCallback
	}

	let { is_recording, user_transcript, on_toggle_recording }: Props = $props()

	let recording_styles = $derived(
		is_recording ? 'border border-red-300/30 bg-red-500 hover:border-red-300/60' : '',
	)

	let transcript_styles = $derived(user_transcript ? 'text-white' : '')
</script>

<Section heading="Speak">
	<IconButton
		onclick={on_toggle_recording}
		class={recording_styles}
		label={is_recording ? 'Stop' : 'Record'}
	>
		{#if is_recording}
			<StopIcon />
		{:else}
			<MicrophoneIcon />
		{/if}
	</IconButton>

	<div class="content-glass {transcript_styles}">
		{#if user_transcript}
			<span class="text-base font-bold drop-shadow">{user_transcript}</span>
		{:else}
			<div class="flex items-center justify-center gap-2">
				<span class="text-base font-semibold">You …</span>
				<ChevronDownIcon />
			</div>
		{/if}
	</div>
</Section>
