<script lang="ts">
	import { ChevronDownIcon } from '$lib/components/icons'
	import type { VoidCallback } from '$lib/types'

	interface Props {
		is_revealed: boolean
		label: string
		content: string
		on_toggle: VoidCallback
		class?: string
		data_action?: string
	}

	const {
		is_revealed,
		label,
		content,
		on_toggle,
		class: class_names = '',
		data_action,
	}: Props = $props()

	const revealed_style = $derived(is_revealed ? 'text-white' : '')
	const button_classes = $derived(`btn-content-glass ${class_names} ${revealed_style}`)
</script>

<button
	type="button"
	onclick={on_toggle}
	class={button_classes}
	data-testid="toggle-{label.toLowerCase()}"
	aria-label="Toggle {label}"
	aria-expanded={is_revealed}
	data-action={data_action}
>
	{#if is_revealed}
		<span class="text-content-bold whitespace-pre-line" data-testid="{label.toLowerCase()}-content"
			>{content}</span
		>
	{:else}
		<div class="flex-center">
			<span class="text-content-semibold">{label}</span>
			<ChevronDownIcon />
		</div>
	{/if}
</button>
