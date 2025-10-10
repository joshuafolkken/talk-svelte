<script lang="ts">
	interface Props {
		is_recording: boolean
		user_transcript: string
		on_toggle_recording: () => void
	}

	let { is_recording, user_transcript, on_toggle_recording }: Props = $props()
</script>

<!-- Recording Section -->
<div class="border-b border-white/25 p-12" style="background: rgba(255, 255, 255, 0.05);">
	<h3
		class="mb-8 text-center text-sm font-bold tracking-widest text-white uppercase drop-shadow-md"
	>
		Speak
	</h3>
	<div class="flex flex-col items-center gap-6">
		<button
			onclick={on_toggle_recording}
			class="flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 {is_recording
				? 'animate-pulse border border-red-300/30 bg-red-500 text-white hover:border-red-300/60'
				: 'border border-white/30 text-white hover:border-white/60'}"
			style={is_recording
				? ''
				: 'background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);'}
		>
			<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
				{#if is_recording}
					<rect x="6" y="6" width="12" height="12" rx="2" />
				{:else}
					<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
					<path
						d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
					/>
				{/if}
			</svg>
		</button>

		<div
			class="w-full rounded-xl border p-5 text-center shadow-lg transition-all duration-200 {user_transcript
				? 'border-white/60 text-white'
				: 'border-white/30 text-white/80'}"
			style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
		>
			{#if user_transcript}
				<span class="text-base font-bold drop-shadow">{user_transcript}</span>
			{:else}
				<div class="flex items-center justify-center gap-2">
					<span class="text-base font-semibold">Your Speech...</span>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			{/if}
		</div>
	</div>
</div>
