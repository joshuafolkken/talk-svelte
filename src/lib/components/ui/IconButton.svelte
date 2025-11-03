<script lang="ts">
	import { UI, type ButtonSize } from '$lib/constants/ui'
	import type { VoidCallback } from '$lib/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onclick: VoidCallback
		size?: ButtonSize
		class?: string
		label?: string
		data_action?: string
		children: Snippet
	}

	const {
		onclick,
		size = UI.BUTTON_SIZES.MD,
		class: class_names = '',
		label,
		children,
		data_action,
	}: Props = $props()

	const size_classes = $derived(size === UI.BUTTON_SIZES.LG ? 'h-20 w-20' : 'h-12 w-12')
</script>

<button
	type="button"
	{onclick}
	class="btn-icon-glass {size_classes} {class_names}"
	aria-label={label}
	data-action={data_action}
>
	{@render children()}
</button>
