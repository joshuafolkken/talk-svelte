<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import { ChevronDownIcon } from './icons'

	interface Props {
		user_transcript: string
		is_correct: boolean
		onclick: VoidCallback
		class?: string
	}

	const { user_transcript, is_correct, onclick: onclick, class: class_names = '' }: Props = $props()

	const transcript_style = $derived(user_transcript.length > 0 ? 'text-white' : '')
	const correct_style = $derived(is_correct ? 'bg-green-600' : '')
	const button_classes = $derived(
		`btn-content-glass ${class_names} ${transcript_style} ${correct_style}`,
	)
</script>

<button type="button" {onclick} class={button_classes} aria-label="Clear user transcript">
	{#if user_transcript}
		<span class="text-content-bold">{user_transcript}</span>
	{:else}
		<div class="flex-center">
			<span class="text-content-semibold">You …</span>
			<ChevronDownIcon />
		</div>
	{/if}
</button>
