<script lang="ts">
	import { ICON_SIZES, type IconSize } from '$lib/constants'
	import type { Snippet } from 'svelte'

	interface Props {
		size?: IconSize
		is_filled?: boolean
		children: Snippet
	}

	const { size = ICON_SIZES.sm, is_filled = false, children }: Props = $props()

	const size_classes = $derived.by(() => {
		switch (size) {
			case ICON_SIZES.lg: {
				return 'h-8 w-8'
			}
			case ICON_SIZES.md: {
				return 'h-6 w-6'
			}
			default: {
				return 'h-4 w-4'
			}
		}
	})

	const fill = $derived(is_filled ? 'currentColor' : 'none')
	const stroke = $derived(is_filled ? undefined : 'currentColor')
	const stroke_width = $derived(is_filled ? undefined : 2)
</script>

<svg class={size_classes} {fill} {stroke} stroke-width={stroke_width} viewBox="0 0 24 24">
	{@render children()}
</svg>
