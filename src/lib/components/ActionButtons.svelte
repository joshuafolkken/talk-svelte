<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { ArrowRightIcon, HeartIcon, RetryIcon } from './icons'
	import ArrowLeftIcon from './icons/ArrowLeftIcon.svelte'

	interface Props {
		liked: boolean
		on_toggle_like: VoidCallback
		on_retry: VoidCallback
		on_next: VoidCallback
		on_preview: VoidCallback
	}

	let { liked, on_toggle_like, on_retry, on_next, on_preview }: Props = $props()

	let like_button_style = $derived(liked ? 'liked-active' : '')
</script>

<div class="mt-5 flex flex-wrap items-center justify-center gap-4">
	<IconButton onclick={on_toggle_like} class={like_button_style}>
		<HeartIcon {liked} />
	</IconButton>

	<IconButton onclick={on_retry}>
		<RetryIcon />
	</IconButton>

	<IconButton onclick={on_preview}>
		<ArrowLeftIcon />
	</IconButton>

	<IconButton onclick={on_next}>
		<ArrowRightIcon />
	</IconButton>
</div>
