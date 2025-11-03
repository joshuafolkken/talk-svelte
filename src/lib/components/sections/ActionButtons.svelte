<script lang="ts">
	import {
		ArrowLeftIcon,
		ArrowRightIcon,
		HeartIcon,
		RetryIcon,
		TrophyIcon,
	} from '$lib/components/icons'
	import IconButton from '$lib/components/ui/IconButton.svelte'
	import { ACTIONS } from '$lib/constants/actions'
	import { UI } from '$lib/constants/ui'
	import type { VoidCallback } from '$lib/types'

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

	const like_button_style = $derived(is_liked ? UI.BUTTON_STYLES.LIKED_ACTIVE : '')
	const trophy_button_style = $derived(is_completed ? UI.BUTTON_STYLES.TROPHY_ACTIVE : '')
</script>

<div class="mt-5 flex flex-wrap items-center justify-center gap-4">
	<IconButton onclick={on_toggle_like} class={like_button_style}>
		<HeartIcon {is_liked} />
	</IconButton>

	<IconButton onclick={on_retry} data_action={ACTIONS.RETRY}>
		<RetryIcon />
	</IconButton>

	<IconButton onclick={on_preview} data_action={ACTIONS.PREV}>
		<ArrowLeftIcon />
	</IconButton>

	<IconButton onclick={on_next} data_action={ACTIONS.NEXT}>
		<ArrowRightIcon />
	</IconButton>

	<IconButton onclick={on_toggle_completed} class={trophy_button_style}>
		<TrophyIcon />
	</IconButton>
</div>
