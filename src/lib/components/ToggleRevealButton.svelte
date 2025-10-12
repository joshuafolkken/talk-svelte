<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import { ChevronDownIcon } from './icons'

	interface Props {
		revealed: boolean
		label: string
		content: string
		on_toggle: VoidCallback
		class?: string
	}

	let { revealed, label, content, on_toggle, class: class_names = '' }: Props = $props()

	let revealed_styles = $derived(revealed ? 'text-white' : '')
</script>

<button onclick={on_toggle} class="btn-content-glass {class_names} {revealed_styles}">
	{#if revealed}
		<span class="text-base font-bold whitespace-pre-line drop-shadow">{content}</span>
	{:else}
		<div class="flex items-center justify-center gap-2">
			<span class="text-base font-semibold">{label}</span>
			<ChevronDownIcon />
		</div>
	{/if}
</button>
