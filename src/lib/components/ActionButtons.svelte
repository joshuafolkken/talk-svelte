<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import Button from './Button.svelte'
	import { ArrowRightIcon, HeartIcon, RetryIcon } from './icons'

	interface Props {
		liked: boolean
		on_toggle_like: VoidCallback
		on_retry: VoidCallback
		on_next: VoidCallback
	}

	let { liked, on_toggle_like, on_retry, on_next }: Props = $props()

	let like_button_style = $derived(liked ? 'liked-active' : '')
	let like_button_text = $derived(liked ? 'Liked' : 'Like')
</script>

<div class="flex flex-wrap items-center justify-center gap-4 p-8">
	<Button onclick={on_toggle_like} class={like_button_style}>
		<HeartIcon {liked} />
		{like_button_text}
	</Button>

	<Button onclick={on_retry}>
		<RetryIcon />
		Retry
	</Button>

	<Button onclick={on_next}>
		Next
		<ArrowRightIcon />
	</Button>
</div>
