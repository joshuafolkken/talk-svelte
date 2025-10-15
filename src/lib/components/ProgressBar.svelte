<script lang="ts">
	interface Props {
		current: number
		total: number
		title?: string
	}

	let { current, total, title }: Props = $props()

	let progress_percentage = $derived((current / total) * 100)
</script>

<div class="mb-6">
	<div class="mb-2 flex items-center justify-between">
		{#if title}
			<h1 class="text-sm font-bold tracking-wide text-white uppercase drop-shadow-md">
				{title}
			</h1>
		{/if}
		<span class="ml-auto text-sm font-bold text-white drop-shadow-md">
			{current} / {total}
		</span>
	</div>
	<div class="glass-content h-2 overflow-hidden rounded-full border border-white/40 shadow-xl">
		<div
			class="h-full rounded-full bg-white shadow-lg transition-all duration-500"
			style="width: {progress_percentage}%"
		></div>
	</div>
</div>
