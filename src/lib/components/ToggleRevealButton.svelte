<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import { ChevronDownIcon } from './icons'

	interface Props {
		is_revealed: boolean
		label: string
		content: string
		on_toggle: VoidCallback
		class?: string
	}

	const { is_revealed, label, content, on_toggle, class: class_names = '' }: Props = $props()

	const revealed_style = $derived(is_revealed ? 'text-white' : '')
	const button_classes = $derived(`btn-content-glass ${class_names} ${revealed_style}`)
</script>

<button
	type="button"
	onclick={on_toggle}
	class={button_classes}
	aria-label="Toggle {label}"
	aria-expanded={is_revealed}
>
	{#if is_revealed}
		<span class="text-content-bold whitespace-pre-line">{content}</span>
	{:else}
		<div class="flex-center">
			<span class="text-content-semibold">{label}</span>
			<ChevronDownIcon />
		</div>
	{/if}
</button>
