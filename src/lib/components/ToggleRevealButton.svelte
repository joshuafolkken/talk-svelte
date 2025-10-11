<script lang="ts">
	import type { VoidCallback } from '$lib/types'

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
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	{/if}
</button>
