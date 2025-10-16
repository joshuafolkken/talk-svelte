<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onclick: VoidCallback
		size?: 'md' | 'lg'
		class?: string
		label?: string
		children: Snippet
	}

	let { onclick, size = 'md', class: class_names = '', label, children }: Props = $props()

	let size_classes = $derived(size === 'lg' ? 'h-20 w-20' : 'h-12 w-12')
</script>

<button
	type="button"
	{onclick}
	class="btn-icon-glass {size_classes} {class_names}"
	aria-label={label}
>
	{@render children()}
</button>
