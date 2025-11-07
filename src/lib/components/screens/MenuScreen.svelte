<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { back_to_the_future } from '$lib/data/phrases/back-to-the-future'
	import { keyboard } from '$lib/keyboard/keyboard'
	import { on_keydown } from '$lib/keyboard/on-keydown'
	import { storage } from '$lib/utils/storage'

	const LAST_SELECTED_COLLECTION_KEY = 'last_selected_collection'

	const collections = back_to_the_future.key_collections.map((_, index) => ({
		index,
		title: `#${String(index + 1)}`,
	}))

	function select_collection(index: number): void {
		storage.set_number(LAST_SELECTED_COLLECTION_KEY, index)
		void goto(resolve(`./${String(index)}`))
	}

	let active_index = 0
	const buttons: Array<HTMLButtonElement | undefined> = []

	function register(node: HTMLButtonElement, index: number): { destroy: () => void } {
		buttons[index] = node
		return {
			destroy: () => {
				if (buttons[index] === node) buttons[index] = undefined
			},
		}
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, value))
	}

	function focus_by_index(index: number): void {
		active_index = clamp(index, 0, collections.length - 1)
		const button = buttons[active_index]
		if (button !== undefined) button.focus()
	}

	const handlers: Record<string, () => void> = {
		[keyboard.KEYS.W]: () => {
			focus_by_index(active_index - 1)
		},
		[keyboard.KEYS.S]: () => {
			focus_by_index(active_index + 1)
		},
		[keyboard.KEYS.SPACE]: () => {
			buttons[active_index]?.click()
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
			const last_selected_collection = storage.get_number(LAST_SELECTED_COLLECTION_KEY) ?? 0
			focus_by_index(last_selected_collection)
		})

		globalThis.addEventListener('keydown', handle_keydown)
		return () => {
			globalThis.removeEventListener('keydown', handle_keydown)
		}
	})
</script>

<div class="card-glass">
	<div class="px-6 pt-6">
		<h1 class="mb-6 text-center text-xl font-bold text-white">Back to the Future</h1>
		<p class=" text-center text-sm text-gray-300">Choose your future!</p>
	</div>

	<div class="py-5">
		<div class="max-h-[536px] overflow-y-auto px-6 py-1">
			<div class="space-y-4">
				{#each collections as collection (collection.index)}
					<button
						use:register={collection.index}
						onclick={() => {
							select_collection(collection.index)
						}}
						class="btn-content-glass w-full"
					>
						<h2 class="text-md font-semibold text-white">
							{collection.title}
						</h2>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
