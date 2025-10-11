<script lang="ts">
	interface Props {
		is_recording: boolean
		user_transcript: string
		on_toggle_recording: () => void
	}

	let { is_recording, user_transcript, on_toggle_recording }: Props = $props()

	let recording_styles = $derived(
		is_recording ? 'border border-red-300/30 bg-red-500 hover:border-red-300/60' : '',
	)

	let transcript_styles = $derived(user_transcript ? 'text-white' : '')
</script>

<!-- Recording Section -->
<div class="border-b border-white/25 p-12">
	<div class="flex flex-col items-center gap-8">
		<h3 class="section-header">Speak</h3>
		<button onclick={on_toggle_recording} class="btn-icon-glass h-20 w-20 {recording_styles}">
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

		<div class="content-glass {transcript_styles}">
			{#if user_transcript}
				<span class="text-base font-bold drop-shadow">{user_transcript}</span>
			{:else}
				<div class="flex items-center justify-center gap-2">
					<span class="text-base font-semibold">You …</span>
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
