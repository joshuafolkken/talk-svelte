<script lang="ts">
	interface Props {
		current: number
		total: number
		title?: string
	}

	let { current, total, title }: Props = $props()

	let progress_percentage = $derived((current / total) * 100)
</script>

<div class="mb-12">
	<div class="mb-3 flex items-center justify-between">
		<h1
			class="text-sm font-bold tracking-wide text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
		>
			{title}
		</h1>
		<span class="text-sm font-bold text-white drop-shadow-md">
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
