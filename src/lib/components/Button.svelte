<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onclick: VoidCallback
		class?: string
		label?: string
		children: Snippet
	}

	let { onclick, class: class_names = '', label, children }: Props = $props()
</script>

<button type="button" {onclick} class="btn-glass {class_names}" aria-label={label}>
	{@render children()}
</button>
