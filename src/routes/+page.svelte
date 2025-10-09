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

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
				<h1 class="mb-1 text-center text-xl font-bold text-gray-800">🎧 Talk</h1>
				<span>{current_question} / {total_questions}</span>
			</div>
			<div class="h-3 overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
					style="width: {(current_question / total_questions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-2xl bg-white shadow-xl">
			<!-- Audio Section-->
			<div class="border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
				<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">🔊 Listen</h2>
				<div class="mb-6 flex justify-center">
					<button
						onclick={play_audio}
						class="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
					>
						<svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
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
					class="mb-6 w-full rounded-xl bg-white/80 p-4 text-center text-lg shadow-lg ring-1 ring-blue-200/50 transition-all duration-300 {show_transcript
						? 'text-gray-800'
						: 'font-semibold text-gray-600 hover:bg-blue-50'}"
				>
					{#if show_transcript}
						📝 {question.transcript}
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span>📝 Transcript</span>
							<svg
								class="h-5 w-5 text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
					class="mb-6 w-full rounded-xl bg-white/80 p-4 text-center text-lg shadow-lg ring-1 ring-blue-200/50 transition-all duration-300 {show_translation
						? 'text-gray-800'
						: 'font-semibold text-gray-600 hover:bg-blue-50 '}"
				>
					{#if show_translation}
						🌐 {question.translation}
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span>🌐 Translation</span>
							<svg
								class="h-5 w-5 text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
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
			<div class="border-b border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
				<h3 class="mb-4 text-center text-xl font-bold text-gray-800">🎤 Speak</h3>
				<div class="flex flex-col items-center gap-6">
					<button
						onclick={toggle_recording}
						class="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 {is_recording
							? 'animate-pulse bg-red-500 hover:bg-red-600'
							: 'bg-gradient-to-br from-purple-500 to-pink-600 hover:scale-105'} text-white shadow-lg hover:shadow-xl active:scale-95"
					>
						<svg class="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
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
						class="w-full rounded-lg bg-white/80 p-4 text-center text-lg shadow ring-1 ring-purple-200/50 transition-all duration-300 {user_transcript
							? 'text-gray-800'
							: 'font-semibold text-gray-600 '}"
					>
						💬 {user_transcript ? user_transcript : 'Your Speech'}
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center justify-center gap-3 p-6">
				<button
					onclick={toggle_like}
					class="flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all {liked
						? 'bg-red-500 text-white hover:bg-red-600'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{liked ? '❤️' : '🤍'}
					{liked ? 'Liked' : 'Like'}
				</button>

				<button
					onclick={retry}
					class="flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
				>
					🔄 Retry
				</button>

				<button
					onclick={next_question}
					class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
				>
					Next →
				</button>
			</div>
		</div>
	</div>
</div>
