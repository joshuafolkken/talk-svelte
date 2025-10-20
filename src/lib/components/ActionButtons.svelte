<script lang="ts">
	import { BUTTON_STYLES } from '$lib/constants'
	import type { VoidCallback } from '$lib/types'
	import IconButton from './IconButton.svelte'
	import { ArrowRightIcon, HeartIcon, RetryIcon, TrophyIcon } from './icons'
	import ArrowLeftIcon from './icons/ArrowLeftIcon.svelte'

	interface Props {
		is_liked: boolean
		is_completed: boolean
		on_toggle_like: VoidCallback
		on_retry: VoidCallback
		on_next: VoidCallback
		on_preview: VoidCallback
		on_toggle_completed: VoidCallback
	}

	const {
		is_liked,
		is_completed,
		on_toggle_like,
		on_retry,
		on_next,
		on_preview,
		on_toggle_completed,
	}: Props = $props()

	const like_button_style = $derived(is_liked ? BUTTON_STYLES.liked_active : '')
	const trophy_button_style = $derived(is_completed ? BUTTON_STYLES.trophy_active : '')
</script>

<div class="mt-5 flex flex-wrap items-center justify-center gap-4">
	<IconButton onclick={on_toggle_like} class={like_button_style}>
		<HeartIcon {is_liked} />
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
