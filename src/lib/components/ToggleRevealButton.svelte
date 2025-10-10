<script lang="ts">
	interface Props {
		revealed: boolean
		label: string
		content: string
		on_toggle: () => void
		class?: string
	}

	let { revealed, label, content, on_toggle, class: class_name = '' }: Props = $props()
</script>

<button
	onclick={on_toggle}
	class="content-box {class_name} {revealed
		? 'border-white/60 text-white'
		: 'hover:scale-[1.02] hover:border-white/60 hover:shadow-2xl'}"
>
	{#if revealed}
		<span class="text-base font-bold drop-shadow">{content}</span>
	{:else}
		<div class="flex items-center justify-center gap-2">
			<span class="text-base font-semibold">{label}</span>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	{/if}
</button>
