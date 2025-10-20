<script lang="ts">
	import { BUTTON_SIZES, type ButtonSize } from '$lib/constants'
	import type { VoidCallback } from '$lib/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onclick: VoidCallback
		size?: ButtonSize
		class?: string
		label?: string
		children: Snippet
	}

	const {
		onclick,
		size = BUTTON_SIZES.md,
		class: class_names = '',
		label,
		children,
	}: Props = $props()

	const size_classes = $derived(size === BUTTON_SIZES.lg ? 'h-20 w-20' : 'h-12 w-12')
</script>

<button
	type="button"
	{onclick}
	class="btn-icon-glass {size_classes} {class_names}"
	aria-label={label}
>
	{@render children()}
</button>
