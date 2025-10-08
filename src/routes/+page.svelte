<script lang="ts">
	let current_question = 1
	let total_questions = 10
	let is_playing = $state(false)
	let show_transcript = $state(false)
	let show_translation = $state(false)
	let is_recording = $state(false)

	let audio_element: HTMLAudioElement

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

	let question = questions[0]!

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
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-4">
	<div class="mx-auto max-w-2xl">
		<h1 class="mb-1 text-center text-xl font-bold text-gray-800">🎧 Talk</h1>
		<!-- Progress Bar -->
		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
				<span>Progress</span>
				<span>Question {current_question} of {total_questions}</span>
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
				<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">🔊 Listen to the Audio</h2>
				<div class="flex justify-center">
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
			</div>

			<!-- Transcript Section -->
			<div class="border-b border-gray-100 p-6">
				<button
					onclick={toggle_transcript}
					class="w-full rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
				>
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-800">
							📝 Transcript {show_transcript ? '(hide)' : '(Click to show)'}
						</span>
						<svg
							class="h-5 w-5 text-gray-600 transition-transform {show_transcript
								? 'rotate-180'
								: ''}"
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
				</button>
				{#if show_transcript}
					<div class="mt-4 rounded-lg bg-blue-50 p-4 text-lg text-gray-800">
						{question.transcript}
					</div>
				{/if}
			</div>

			<!-- Translation Section -->
			<div class="border-b border-gray-100 p-6">
				<button
					onclick={toggle_translation}
					class="w-full rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
				>
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-800">
							🌐 Translation {show_translation ? '(hide)' : '(Click to show)'}
						</span>
						<svg
							class="h-5 w-5 text-gray-600 transition-transform {show_translation
								? 'rotate-180'
								: ''}"
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
				</button>
				{#if show_translation}
					<div class="mt-4 rounded-lg bg-blue-50 p-4 text-lg text-gray-800">
						{question.translation}
					</div>
				{/if}
			</div>

			<!-- Recording Section -->
			<div class="border-b border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
				<h3 class="mb-4 text-center text-xl font-bold text-gray-800">🎤 Your Response</h3>
				<div class="flex flex-col items-center gap-4">
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
					<span class="text-sm font-medium text-gray-700">
						{is_recording ? 'Recording... (Click to stop)' : 'Click to record'}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>
