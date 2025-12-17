<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { APP } from '$lib/constants/app'
	import { CATEGORIES } from '$lib/data/categories'
	import { keyboard } from '$lib/keyboard/keyboard'
	import { on_keydown } from '$lib/keyboard/on-keydown'
	import { storage } from '$lib/utils/storage'
	import { SvelteMap } from 'svelte/reactivity'

	const LAST_SELECTED_CATEGORY_KEY = 'last_selected_category'
	const category_keys = [...CATEGORIES.keys()]

	let active_key = ''
	const buttons = new SvelteMap<string, HTMLButtonElement>()

	function select_category(key: string): void {
		storage.set_string(LAST_SELECTED_CATEGORY_KEY, key)
		goto(resolve(`/${key}`)) // eslint-disable-line @typescript-eslint/no-floating-promises
	}

	function register(node: HTMLButtonElement, key: string): { destroy: () => void } {
		buttons.set(key, node)

		return {
			destroy: () => {
				if (buttons.get(key) === node) buttons.delete(key)
			},
		}
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, value))
	}

	function get_next_key(key: string, direction: 1 | -1): string {
		const index = category_keys.indexOf(key)
		if (index === -1) return ''
		return category_keys[clamp(index + direction, 0, category_keys.length - 1)] ?? ''
	}

	function focus_by_key(key: string): void {
		if (!CATEGORIES.has(key)) return

		active_key = key
		const button = buttons.get(active_key)
		if (button === undefined) return

		button.focus()
	}

	const handlers: Record<string, () => void> = {
		[keyboard.KEYS.W]: () => {
			const previous_key = get_next_key(active_key, -1)
			focus_by_key(previous_key)
		},
		[keyboard.KEYS.S]: () => {
			const next_key = get_next_key(active_key, 1)
			focus_by_key(next_key)
		},
		[keyboard.KEYS.SPACE]: () => {
			if (active_key === '') return
			const button = buttons.get(active_key)
			if (button === undefined) return
			on_keydown.click_button(button)
		},
	}

	function handle_keydown(event: KeyboardEvent): void {
		const key = on_keydown.normalize(event)
		const handler = handlers[key]
		if (handler === undefined) return
		event.preventDefault()
		handler()
	}

	$effect(() => {
		// 初期フォーカスを最初のボタンに設定
		queueMicrotask(() => {
			const last_selected_key = storage.get_string(LAST_SELECTED_CATEGORY_KEY)
			const initial_key =
				last_selected_key !== undefined && CATEGORIES.has(last_selected_key)
					? last_selected_key
					: (category_keys[0] ?? '')

			focus_by_key(initial_key)
		})

		globalThis.addEventListener('keydown', handle_keydown)
		return () => {
			globalThis.removeEventListener('keydown', handle_keydown)
		}
	})
</script>

<div class="card-glass">
	<div class="px-6 pt-6">
		<h1 class="mb-6 text-center text-xl font-bold text-white">{APP.NAME}</h1>
		<p class=" text-center text-sm text-white/90">Start your journey!</p>
	</div>

	<div class="py-5">
		<div class="max-h-[536px] overflow-y-auto px-6 py-1">
			<div class="space-y-4">
				{#each CATEGORIES as [key, value] (key)}
					<button
						use:register={key}
						onclick={() => {
							select_category(key)
						}}
						class="btn-content-glass w-full"
					>
						<h2 class="text-md font-semibold text-white">
							{value.title}
						</h2>
						<p class="text-xs text-white/80">
							{value.message}
						</p>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
