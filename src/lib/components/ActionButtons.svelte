<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import Button from './Button.svelte'

	interface Props {
		liked: boolean
		on_toggle_like: VoidCallback
		on_retry: VoidCallback
		on_next: VoidCallback
	}

	let { liked, on_toggle_like, on_retry, on_next }: Props = $props()

	let like_button_styles = $derived(liked ? 'border-red-300/60 bg-red-500 text-white' : '')
	let like_icon_fill = $derived(liked ? 'currentColor' : 'none')
	let like_button_text = $derived(liked ? 'Liked' : 'Like')
</script>

<div class="flex flex-wrap items-center justify-center gap-4 p-8">
	<!-- Like Button -->
	<Button onclick={on_toggle_like} class={like_button_styles}>
		<svg
			class="h-4 w-4"
			fill={like_icon_fill}
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
			/>
		</svg>
		{like_button_text}
	</Button>

	<!-- Retry Button -->
	<Button onclick={on_retry}>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
			/>
		</svg>
		Retry
	</Button>

	<!-- Next Button -->
	<Button onclick={on_next}>
		Next
		<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
		</svg>
	</Button>
</div>
