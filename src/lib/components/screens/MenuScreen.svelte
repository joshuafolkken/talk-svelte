<script lang="ts">
	const phrase_collections = [
		{ index: 0, title: '#1' },
		{ index: 1, title: '#2' },
		{ index: 2, title: '#3' },
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
</script>

<div class="card-glass p-6">
	<h1 class="mb-6 text-center text-xl font-bold text-white">Back to the Future</h1>
	<p class="mb-8 text-center text-sm text-gray-300">Choose your future!</p>

	<div class="space-y-4">
		{#each phrase_collections as collection (collection.index)}
			<button
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
