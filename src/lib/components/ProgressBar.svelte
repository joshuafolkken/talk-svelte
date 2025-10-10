<script lang="ts">
	interface Props {
		current: number
		total: number
		title?: string
	}

	let { current, total, title }: Props = $props()
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
	<div
		class="h-2 overflow-hidden rounded-full border border-white/40 shadow-xl"
		style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
	>
		<div
			class="h-full rounded-full bg-white shadow-lg transition-all duration-500"
			style="width: {(current / total) * 100}%"
		></div>
	</div>
</div>
