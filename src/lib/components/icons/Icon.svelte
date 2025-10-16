<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		size?: 'sm' | 'md' | 'lg'
		filled?: boolean
		children: Snippet
	}

	let { size = 'sm', filled = false, children }: Props = $props()

	let size_classes = $derived(size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-6 w-6' : 'h-4 w-4')
	let fill = $derived(filled ? 'currentColor' : 'none')
	let stroke = $derived(filled ? undefined : 'currentColor')
	let stroke_width = $derived(filled ? undefined : 2)
</script>

<svg class={size_classes} {fill} {stroke} stroke-width={stroke_width} viewBox="0 0 24 24">
	{@render children()}
</svg>
