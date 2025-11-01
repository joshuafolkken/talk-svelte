<script lang="ts">
	import { normalize_key } from '$lib/keyboard/create-on-keydown'
	import { KEYS } from '$lib/keyboard/keys'

	const phrase_collections = [
		{ index: 0, title: '#1' },
		{ index: 1, title: '#2' },
		{ index: 2, title: '#3' },
		{ index: 3, title: '#4' },
		{ index: 4, title: '#5' },
		{ index: 5, title: '#6' },
		{ index: 6, title: '#7' },
	]

	function select_collection(index: number): void {
		try {
			const url = new URL(globalThis.location.href)
			url.searchParams.set('collection', index.toString())
			globalThis.location.href = url.toString()
		} catch {
			// URL更新に失敗した場合は何もしない
		}
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
		active_index = clamp(index, 0, phrase_collections.length - 1)
		const button = buttons[active_index]
		if (button !== undefined) button.focus()
	}

	const handlers: Record<string, () => void> = {
		[KEYS.w]: () => {
			focus_by_index(active_index - 1)
		},
		[KEYS.s]: () => {
			focus_by_index(active_index + 1)
		},
		[KEYS.space]: () => {
			buttons[active_index]?.click()
		},
	}

	function handle_keydown(event: KeyboardEvent): void {
		const key = normalize_key(event)
		const handler = handlers[key]
		if (handler === undefined) return
		event.preventDefault()
		handler()
	}

	$effect(() => {
		// 初期フォーカスを最初のボタンに設定
		queueMicrotask(() => {
			focus_by_index(0)
		})
		globalThis.addEventListener('keydown', handle_keydown)
		return () => {
			globalThis.removeEventListener('keydown', handle_keydown)
		}
	})
</script>

<div class="card-glass p-6">
	<h1 class="mb-6 text-center text-xl font-bold text-white">Back to the Future</h1>
	<p class="mb-8 text-center text-sm text-gray-300">Choose your future!</p>

	<div class="space-y-4">
		{#each phrase_collections as collection (collection.index)}
			<button
				use:register={collection.index}
				onclick={() => {
					select_collection(collection.index)
				}}
				class="btn-content-glass w-full"
			>
				<h3 class="text-md font-semibold text-white">
					{collection.title}
				</h3>
			</button>
		{/each}
	</div>
</div>
