<script lang="ts">
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { ArrowRightIcon, HeartIcon, RetryIcon, TrophyIcon } from './icons'
	import ArrowLeftIcon from './icons/ArrowLeftIcon.svelte'

	interface Props {
		liked: boolean
		completed: boolean
		on_toggle_like: VoidCallback
		on_retry: VoidCallback
		on_next: VoidCallback
		on_preview: VoidCallback
		on_toggle_completed: VoidCallback
	}

	let {
		liked,
		completed,
		on_toggle_like,
		on_retry,
		on_next,
		on_preview,
		on_toggle_completed,
	}: Props = $props()

	let like_button_style = $derived(liked ? 'liked-active' : '')
	let trophy_button_style = $derived(completed ? 'trophy-active' : '')
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

	<IconButton onclick={on_toggle_completed} class={trophy_button_style}>
		<TrophyIcon />
	</IconButton>
</div>
