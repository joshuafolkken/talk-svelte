<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onclick: VoidCallback
		class?: string
		children: Snippet
	}

	let { onclick, class: class_names = '', children }: Props = $props()
</script>

<button type="button" {onclick} class="btn-glass {class_names}">
	{@render children()}
</button>
