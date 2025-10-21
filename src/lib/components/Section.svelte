<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		heading: string
		children: Snippet
	}

	const { heading, children }: Props = $props()
</script>

<div class="border-b border-white/25 p-6">
	<div class="flex flex-col items-center gap-6">
		<h2 class="section-header">{heading}</h2>
		{@render children()}
	</div>
</div>
