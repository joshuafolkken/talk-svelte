<script lang="ts">
	import { UI, type IconSize } from '$lib/constants/ui'
	import type { Snippet } from 'svelte'

	interface Props {
		size?: IconSize
		is_filled?: boolean
		children: Snippet
	}

	const STROKE_WIDTH = 2
	const { size = UI.ICON_SIZES.SM, is_filled = false, children }: Props = $props()

	const size_classes = $derived.by(() => {
		switch (size) {
			case UI.ICON_SIZES.LG: {
				return 'h-8 w-8'
			}
			case UI.ICON_SIZES.MD: {
				return 'h-6 w-6'
			}
			case UI.ICON_SIZES.SM: {
				return 'h-4 w-4'
			}
			default: {
				return 'h-4 w-4'
			}
		}
	})

	const fill = $derived(is_filled ? 'currentColor' : 'none')
	const stroke = $derived(is_filled ? undefined : 'currentColor')
	const stroke_width = $derived(is_filled ? undefined : STROKE_WIDTH)
</script>

<svg class={size_classes} {fill} {stroke} stroke-width={stroke_width} viewBox="0 0 24 24">
	{@render children()}
</svg>
