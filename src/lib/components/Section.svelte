<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		heading: string
		children: Snippet
	}

	let { heading, children }: Props = $props()
</script>

<div class="border-b border-white/25 p-12">
	<div class="flex flex-col items-center gap-8">
		<h2 class="section-header">{heading}</h2>
		{@render children()}
	</div>
</div>
