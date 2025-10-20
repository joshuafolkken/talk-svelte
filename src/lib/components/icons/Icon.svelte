<script lang="ts">
	import { ICON_SIZES, type IconSize } from '$lib/constants'
	import type { Snippet } from 'svelte'

	interface Props {
		size?: IconSize
		filled?: boolean
		children: Snippet
	}

	let { size = ICON_SIZES.SM, filled = false, children }: Props = $props()

	let size_classes = $derived(
		size === ICON_SIZES.LG ? 'h-8 w-8' : size === ICON_SIZES.MD ? 'h-6 w-6' : 'h-4 w-4',
	)
	let fill = $derived(filled ? 'currentColor' : 'none')
	let stroke = $derived(filled ? undefined : 'currentColor')
	let stroke_width = $derived(filled ? undefined : 2)
</script>

<svg class={size_classes} {fill} {stroke} stroke-width={stroke_width} viewBox="0 0 24 24">
	{@render children()}
</svg>
