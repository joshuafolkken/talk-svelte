<script lang="ts">
	type Question = {
		audio_uri: string
		transcript: string
		translation: string
	}

	function create_question(audio_uri: string, transcript: string, translation: string): Question {
		return {
			audio_uri,
			transcript,
			translation,
		}
	}

	const questions = [
		create_question('you_nailed_it.mp3', 'You nailed it!', '完璧にやったね！'),
		create_question('live_it.mp3', 'Love it!', 'それ好き！'),
		create_question('awesome.mp3', 'Awesome!', '最高！'),
	]

	let current_question = $state(1)
	let total_questions = $derived(questions.length)
	let is_playing = $state(false)
	let show_transcript = $state(false)
	let show_translation = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('Yay!')
	let liked = $state(false)
	let question = $state(questions[0]!)

	let audio_element: HTMLAudioElement

	function play_audio(): void {
		if (!audio_element) return

		if (is_playing) {
			audio_element.pause()
			is_playing = false
		} else {
			audio_element.play()
			is_playing = true
		}
	}

	function toggle_transcript(): void {
		show_transcript = !show_transcript
	}

	function toggle_translation(): void {
		show_translation = !show_translation
	}

	function toggle_recording(): void {
		is_recording = !is_recording
	}

	function toggle_like(): void {
		liked = !liked
	}

	function retry(): void {
		show_transcript = false
		show_translation = false
		user_transcript = ''
		liked = false

		if (audio_element && is_playing) {
			audio_element.pause()
		}
		is_playing = false
	}

	function next_question(): void {
		if (current_question < total_questions) {
			const next = questions[current_question]
			if (!next) return

			question = next
			current_question++
			retry()
		}
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-12">
	<div class="mx-auto max-w-xl">
		<!-- Progress Bar -->
		<div class="mb-12">
			<div class="mb-3 flex items-center justify-between">
				<h1 class="text-2xl font-light tracking-wide text-gray-900">Talk</h1>
				<span class="text-sm font-medium text-gray-500">{current_question} / {total_questions}</span
				>
			</div>
			<div class="h-1 overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full rounded-full bg-gray-900 transition-all duration-500"
					style="width: {(current_question / total_questions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-3xl border border-gray-200 bg-white">
			<!-- Audio Section-->
			<div class="border-b border-gray-100 p-12">
				<h2 class="mb-8 text-center text-sm font-medium tracking-wider text-gray-500 uppercase">
					Listen
				</h2>
				<div class="mb-8 flex justify-center">
					<button
						onclick={play_audio}
						class="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white active:scale-95"
					>
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
							{#if is_playing}
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							{:else}
								<path d="M8 5v14l11-7z" />
							{/if}
						</svg>
					</button>
				</div>
				<audio
					bind:this={audio_element}
					src="/audio/{question.audio_uri}"
					onended={() => (is_playing = false)}
				></audio>

				<!-- Transcript Section -->
				<button
					onclick={toggle_transcript}
					class="mb-4 w-full rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-300 {show_transcript
						? 'border-gray-900 text-gray-900'
						: 'text-gray-500 hover:border-gray-300'}"
				>
					{#if show_transcript}
						<span class="text-base font-medium">{question.transcript}</span>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span class="text-sm font-medium">Transcript</span>
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
				</button>

				<!-- Translation Section -->
				<button
					onclick={toggle_translation}
					class="w-full rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-300 {show_translation
						? 'border-gray-900 text-gray-900'
						: 'text-gray-500 hover:border-gray-300'}"
				>
					{#if show_translation}
						<span class="text-base font-medium">{question.translation}</span>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span class="text-sm font-medium">Translation</span>
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
				</button>
			</div>

			<!-- Recording Section -->
			<div class="border-b border-gray-100 p-12">
				<h3 class="mb-8 text-center text-sm font-medium tracking-wider text-gray-500 uppercase">
					Speak
				</h3>
				<div class="flex flex-col items-center gap-6">
					<button
						onclick={toggle_recording}
						class="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 {is_recording
							? 'bg-red-500 text-white'
							: 'border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white'} active:scale-95"
					>
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
							{#if is_recording}
								<rect x="6" y="6" width="12" height="12" rx="2" />
							{:else}
								<path
									d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
								/>
								<path
									d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
								/>
							{/if}
						</svg>
					</button>

					<div
						class="w-full rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-300 {user_transcript
							? 'border-gray-900 text-gray-900'
							: 'text-gray-500'}"
					>
						<span class="text-base font-medium"
							>{user_transcript ? user_transcript : 'Your Speech'}</span
						>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center justify-center gap-3 p-8">
				<button
					onclick={toggle_like}
					class="flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-medium transition-all {liked
						? 'border-red-500 bg-red-500 text-white'
						: 'border-gray-200 text-gray-700 hover:border-gray-900'}"
				>
					<svg
						class="h-4 w-4"
						fill={liked ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					{liked ? 'Liked' : 'Like'}
				</button>

				<button
					onclick={retry}
					class="flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Retry
				</button>

				<button
					onclick={next_question}
					class="flex items-center gap-2 rounded-full bg-gray-900 px-8 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95"
				>
					Next
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
